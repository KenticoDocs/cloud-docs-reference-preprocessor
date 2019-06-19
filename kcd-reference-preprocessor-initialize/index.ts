import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { deliveryClient } from '../shared/external/kenticoCloudClient';
import { getProcessedData } from '../shared/processing/getProcessedData';
import { ZapiSpecification } from '../shared/models/zapi_specification';

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    const response = await deliveryClient
        .items<ZapiSpecification>()
        .type('zapi_specification')
        .queryConfig({
            usePreviewMode: true,
        })
        .depthParameter(5)
        .getPromise();

    const data = getProcessedData(response.items, response.linkedItems);

    context.res = {
        body: data,
    };
};

export default httpTrigger;
