import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { storeReferenceDataToBlobStorage } from '../shared/external/blobManager';
import { Configuration } from '../shared/external/configuration';
import { getPreviewDeliveryClient } from '../shared/external/kenticoCloudClient';
import { ZapiSpecification } from '../shared/models/zapi_specification';
import { getProcessedData } from '../shared/processing/getProcessedData';
import { IBlobObject } from '../shared/types/dataModels';

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    try {
        Configuration.set(req.query.isTest === 'enabled');

        const response = await getPreviewDeliveryClient()
            .items<ZapiSpecification>()
            .type('zapi_specification')
            .queryConfig({
                usePreviewMode: true,
            })
            .depthParameter(5)
            .getPromise();

        const data = getProcessedData(response.items, response.linkedItems);

        data.forEach((blob: IBlobObject) => storeReferenceDataToBlobStorage(blob, true));

        context.res = {
            body: data,
        };
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};

export default httpTrigger;
