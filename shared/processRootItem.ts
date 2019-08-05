import { IKenticoCloudError } from 'cloud-docs-shared-code';
import {
    IPreprocessedData,
    ReferenceOperation,
} from 'cloud-docs-shared-code/reference/preprocessedModels';
import { IDeliveryClient } from 'kentico-cloud-delivery';
import { storeReferenceDataToBlobStorage } from './external/blobManager';
import { DepthParameter } from './external/kenticoCloudClient';
import { ZapiSpecification } from './models/zapi_specification';
import { getProcessedData } from './processing/getProcessedData';

export const processRootItem = async (
    codename: string,
    operation: ReferenceOperation,
    deliveryClientGetter: () => IDeliveryClient,
): Promise<void> => {
    const response = await deliveryClientGetter()
        .item<ZapiSpecification>(codename)
        .depthParameter(DepthParameter)
        .getPromise()
        .catch((error) => handleNotFoundItem(error, codename, operation));

    if (response) {
        const data = getProcessedData(
            response.item,
            response.linkedItems,
            operation,
        );

        await storeReferenceDataToBlobStorage(data, operation);
    }
};

const handleNotFoundItem = async (
    error: IKenticoCloudError,
    codename: string,
    operation: ReferenceOperation,
): Promise<void> => {
    if (error.errorCode === 100) {
        const notFoundItem: IPreprocessedData = {
            items: [],
            operation,
            zapiSpecificationCodename: codename,
        };
        await storeReferenceDataToBlobStorage(notFoundItem, ReferenceOperation.Update);
    } else {
        throw error;
    }
};
