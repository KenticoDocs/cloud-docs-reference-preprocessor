import {
    AzureFunction,
    Context,
    HttpRequest,
} from '@azure/functions';
import { storeReferenceDataToBlobStorage } from '../shared/external/blobManager';
import { Configuration } from '../shared/external/configuration';
import { getDeliveryClient } from '../shared/external/kenticoCloudClient';
import { Operation } from '../shared/external/models';
import { resolveItemInRichText } from '../shared/external/richTextResolver';
import { ZapiSpecification } from '../shared/models/zapi_specification';
import { DataProcessor } from '../shared/processing/getProcessedData';
import { IPreprocessedData } from '../shared/types/dataModels';

const operation = Operation.Initialize;

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    try {
        Configuration.set(req.query.isTest === 'enabled');

        const response = await getDeliveryClient()
            .items<ZapiSpecification>()
            .type('zapi_specification')
            .queryConfig({
                richTextResolver: resolveItemInRichText,
            })
            .depthParameter(9)
            .getPromise();

        const dataProcessor = new DataProcessor();
        const data = dataProcessor.getProcessedData(
            response.items,
            response.linkedItems,
            operation);

        data.forEach((blob: IPreprocessedData) => storeReferenceDataToBlobStorage(blob, operation));

        context.res = {
            body: data,
        };
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};

export default httpTrigger;
