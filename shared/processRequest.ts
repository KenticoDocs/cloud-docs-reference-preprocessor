import {
    Context,
    HttpRequest,
} from '@azure/functions';
import { ReferenceOperation } from 'cloud-docs-shared-code/reference/preprocessedModels';
import { Configuration } from './external/configuration';
import {
    getDeliveryClient,
    getPreviewDeliveryClient,
} from './external/kenticoCloudClient';
import { processAllItems } from './processAllItems';

export const processRequest = async (
    context: Context, req: HttpRequest,
    operation: ReferenceOperation,
): Promise<void> => {
    try {
        Configuration.set(req.query.isTest === 'enabled');

        const getClient = operation === ReferenceOperation.Preview
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
