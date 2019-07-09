import {
    AzureFunction,
    Context,
    HttpRequest,
} from '@azure/functions';
import { Operation } from '../shared/external/models';
import { processRequest } from '../shared/processRequest';

const httpTriggerInitialize: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> =>
    processRequest(context, req, Operation.Initialize);

export default httpTriggerInitialize;
