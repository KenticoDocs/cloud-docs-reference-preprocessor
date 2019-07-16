import {
    AzureFunction,
    Context,
    HttpRequest,
} from '@azure/functions';
import { ReferenceOperation } from 'cloud-docs-shared-code/reference/preprocessedModels';
import { processRequest } from '../shared/processRequest';

const httpTriggerInitialize: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> =>
    processRequest(context, req, ReferenceOperation.Initialize);

export default httpTriggerInitialize;
