import {
    AzureFunction,
    Context,
} from '@azure/functions';
import { Configuration } from '../shared/external/configuration';
import {
    IEventGridEvent,
    Operation,
} from '../shared/external/models';
import { processRootItem } from '../shared/processRootItem';
import { getCodenamesOfRootItems } from './getCodenamesOfRootItems';

const eventGridTrigger: AzureFunction = async (context: Context, eventGridEvent: IEventGridEvent): Promise<void> => {
    try {
        Configuration.set(eventGridEvent.data.test === 'enabled');
        const rootItemsCodenames = await getCodenamesOfRootItems(eventGridEvent.data.webhook.items);

        rootItemsCodenames.forEach(async (codename) => await processRootItem(codename, Operation.Update));
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};

export default eventGridTrigger;
