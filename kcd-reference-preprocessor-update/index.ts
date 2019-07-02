import { AzureFunction, Context } from '@azure/functions';
import { ContentItem } from 'kentico-cloud-delivery';
import { storeReferenceDataToBlobStorage } from '../shared/external/blobManager';
import { Configuration } from '../shared/external/configuration';
import { getDeliveryClient } from '../shared/external/kenticoCloudClient';
import { IEventGridEvent, IWebhookContentItem, Operation } from '../shared/external/models';
import { resolveItemInRichText } from '../shared/external/richTextResolver';
import { ZapiSpecification } from '../shared/models/zapi_specification';
import { getProcessedData } from '../shared/processing/getProcessedData';
import { IPreprocessedData } from '../shared/types/dataModels';
import { getRootCodenamesOfSingleItem } from '../shared/utils/rootItemsGetter';

const operation = Operation.Update;

const eventGridTrigger: AzureFunction = async (context: Context, eventGridEvent: IEventGridEvent): Promise<void> => {
    try {
        Configuration.set(eventGridEvent.data.test === 'enabled');
        const rootItemsCodenames = await getCodenamesOfRootItemsToIndex(eventGridEvent.data.webhook.items);

        await rootItemsCodenames.forEach((codename: string) =>
            getDeliveryClient()
                .item<ZapiSpecification>(codename)
                .depthParameter(9)
                .queryConfig({
                    richTextResolver: resolveItemInRichText,
                })
                .getPromise()
                .then(async (response) => {
                    const data = getProcessedData(
                        [response.item],
                        response.linkedItems,
                        operation);

                    data.forEach((blob: IPreprocessedData) => storeReferenceDataToBlobStorage(blob, operation));

                    return response;
                })
                .catch((error) => handleError(error, codename)));

    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};

const getCodenamesOfRootItemsToIndex = async (items: IWebhookContentItem[]): Promise<Set<string>> => {
    const allItems = await getAllItems();
    const rootCodenames = new Set<string>();

    items.forEach((item) => {
        const roots = getRootCodenamesOfSingleItem(item, allItems);
        roots.forEach((codename) => rootCodenames.add(codename));
    });

    return rootCodenames;
};

const getAllItems = async (): Promise<ContentItem[]> =>
    await getDeliveryClient()
        .items()
        .type('zapi_specification')
        .depthParameter(0)
        .getPromise()
        .then((response) =>
            response.items.concat(response.linkedItems),
        );

async function handleError(error: any, codename: string): Promise<void> {
    if (error.errorCode === 100) {
        const notFoundItem: IPreprocessedData = {
            items: [],
            operation: Operation.Update,
            zapiSpecificationCodename: codename,
        };
        await storeReferenceDataToBlobStorage(notFoundItem, Operation.Update);
    } else {
        throw error;
    }
}

export default eventGridTrigger;
