import {
    Context,
    HttpRequest,
} from '@azure/functions';
import { Configuration } from './external/configuration';
import {
    getDeliveryClient,
    getPreviewDeliveryClient,
} from './external/kenticoCloudClient';
import { Operation } from './external/models';
import { processAllItems } from './processAllItems';

export const processRequest = async (context: Context, req: HttpRequest, operation: Operation): Promise<void> => {
    try {
        Configuration.set(req.query.isTest === 'enabled');

        const getClient = operation === Operation.Preview
            ? getPreviewDeliveryClient
            : getDeliveryClient;
        const previewData = await processAllItems(getClient, operation);

        context.res = {
            body: previewData,
        };
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};
