import {
    AzureFunction,
    Context,
} from '@azure/functions';
import { IWebhookEventGridEvent } from 'cloud-docs-shared-code';
import { ReferenceOperation } from 'cloud-docs-shared-code/reference/preprocessedModels';
import { Configuration } from '../shared/external/configuration';
import { processRootItem } from '../shared/processRootItem';
import { getCodenamesOfRootItems } from './getCodenamesOfRootItems';

const eventGridTrigger: AzureFunction = async (
    context: Context,
    eventGridEvent: IWebhookEventGridEvent,
): Promise<void> => {
    try {
        Configuration.set(eventGridEvent.data.test === 'enabled');
        const rootItemsCodenames = await getCodenamesOfRootItems(eventGridEvent.data.webhook.items);
        const processRootItemFunctions = [...rootItemsCodenames].map(
            (codename) => processRootItem(codename, ReferenceOperation.Update),
        );

        await Promise.all(processRootItemFunctions);
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};

export default eventGridTrigger;
