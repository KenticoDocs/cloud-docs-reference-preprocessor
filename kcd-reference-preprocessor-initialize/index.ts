import {
    AzureFunction,
    Context,
    HttpRequest,
} from '@azure/functions';
import { ReferenceOperation } from 'cloud-docs-shared-code';
import { Configuration } from '../shared/external/configuration';
import { getDeliveryClient } from '../shared/external/kenticoCloudClient';
import { ProcessedSchemaCodenames } from '../shared/processing/ProcessedSchemaCodenames';
import { processRootItem } from '../shared/processRootItem';

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    try {
        Configuration.set(false);

        ProcessedSchemaCodenames.initialize();

        const data = await processRootItem(
            req.query.codename,
            ReferenceOperation.Initialize,
            getDeliveryClient,
        );

        context.res = {
            body: data,
        };
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};

export default httpTrigger;