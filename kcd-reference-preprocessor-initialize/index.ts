import {
    AzureFunction,
    Context,
    HttpRequest,
} from '@azure/functions';
import { Configuration, Operation } from 'cloud-docs-shared-code';
import { initializeProcessedSchemaCodenames } from '../shared/processing/ProcessedSchemaCodenames';
import { processRootItem } from '../shared/processRootItem';

export const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    try {
        Configuration.set(false);

        initializeProcessedSchemaCodenames(req.query.codename);

        const data = await processRootItem(
            req.query.codename,
            Operation.Initialize,
        );

        context.res = {
            body: data,
        };
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};
