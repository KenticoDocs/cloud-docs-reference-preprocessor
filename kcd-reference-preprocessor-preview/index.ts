import {
    AzureFunction,
    Context,
    HttpRequest,
} from '@azure/functions';
import { Operation } from '../shared/external/models';
import { processRequest } from '../shared/processRequest';

const httpTriggerPreview: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> =>
    processRequest(context, req, Operation.Preview);

export default httpTriggerPreview;
