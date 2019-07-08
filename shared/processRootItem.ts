import { storeReferenceDataToBlobStorage } from './external/blobManager';
import {
    DepthParameter,
    getDeliveryClient,
} from './external/kenticoCloudClient';
import {
    IKenticoCloudError,
    Operation,
} from './external/models';
import { resolveItemInRichText } from './external/richTextResolver';
import { ZapiSpecification } from './models/zapi_specification';
import { getProcessedData } from './processing/getProcessedData';
import { IPreprocessedData } from './processing/processedDataModels';

export const processRootItem = async (codename: string, operation: Operation): Promise<void> => {
    const response = await getDeliveryClient()
        .item<ZapiSpecification>(codename)
        .depthParameter(DepthParameter)
        .queryConfig({
            richTextResolver: resolveItemInRichText,
        })
        .getPromise()
        .catch((error) => handleNotFoundItem(error, codename));

    if (response) {
        const data = getProcessedData(
            [response.item],
            response.linkedItems,
            operation);
        data.forEach((blob: IPreprocessedData) => storeReferenceDataToBlobStorage(blob, operation));
    }
};

const handleNotFoundItem = async (error: IKenticoCloudError, codename: string): Promise<void> => {
    if (error.errorCode === 100) {
        const notFoundItem: IPreprocessedData = {
            items: [],
            operation: Operation.Update,
            zapiSpecificationCodename: codename,
        };
        await storeReferenceDataToBlobStorage(notFoundItem, Operation.Update);
    } else {
        throw error;
    }
};
