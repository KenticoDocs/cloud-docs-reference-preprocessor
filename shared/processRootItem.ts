import { IKenticoCloudError } from 'cloud-docs-shared-code';
import {
    IPreprocessedData,
    ReferenceOperation,
} from 'cloud-docs-shared-code/reference/preprocessedModels';
import { storeReferenceDataToBlobStorage } from './external/blobManager';
import {
    DepthParameter,
    getDeliveryClient,
} from './external/kenticoCloudClient';
import { ZapiSpecification } from './models/zapi_specification';
import { getProcessedData } from './processing/getProcessedData';

export const processRootItem = async (codename: string, operation: ReferenceOperation): Promise<void> => {
    const response = await getDeliveryClient()
        .item<ZapiSpecification>(codename)
        .depthParameter(DepthParameter)
        .getPromise()
        .catch((error) => handleNotFoundItem(error, codename));

    if (response) {
        const data = getProcessedData(
            [response.item],
            response.linkedItems,
            operation,
        );
        data.forEach((blob: IPreprocessedData) => storeReferenceDataToBlobStorage(blob, operation));
    }
};

const handleNotFoundItem = async (error: IKenticoCloudError, codename: string): Promise<void> => {
    if (error.errorCode === 100) {
        const notFoundItem: IPreprocessedData = {
            items: [],
            operation: ReferenceOperation.Update,
            zapiSpecificationCodename: codename,
        };
        await storeReferenceDataToBlobStorage(notFoundItem, ReferenceOperation.Update);
    } else {
        throw error;
    }
};
