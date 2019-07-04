import {
    AzureFunction,
    Context,
    HttpRequest,
} from '@azure/functions';
import { Configuration } from '../shared/external/configuration';
import { getPreviewDeliveryClient } from '../shared/external/kenticoCloudClient';
import { Operation } from '../shared/external/models';
import { processAllItems } from '../shared/processAllItems';

const httpTriggerUpdate: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    try {
        Configuration.set(req.query.isTest === 'enabled');
        const previewData = await processAllItems(getPreviewDeliveryClient, Operation.Preview);

        context.res = {
            body: previewData,
        };
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};

export default httpTriggerUpdate;
