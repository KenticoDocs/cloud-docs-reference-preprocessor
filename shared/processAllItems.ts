import {
    IPreprocessedData,
    ReferenceOperation,
} from 'cloud-docs-shared-code/reference/preprocessedModels';
import { IDeliveryClient } from 'kentico-cloud-delivery';
import { storeReferenceDataToBlobStorage } from './external/blobManager';
import { getApiItems } from './external/kenticoCloudClient';
import { getProcessedData } from './processing/getProcessedData';

export const processAllItems = async (deliveryClientGetter: () => IDeliveryClient, operation: ReferenceOperation) => {
    const responseItems = await getApiItems(deliveryClientGetter);

    const data = getProcessedData(
        responseItems.items,
        responseItems.linkedItems,
        operation,
    );

    data.forEach((blob: IPreprocessedData) => storeReferenceDataToBlobStorage(blob, operation));

    return data;
};
