import {
  IKenticoCloudError,
  IPreprocessedData,
  ReferenceOperation
} from 'cloud-docs-shared-code';
import {
  ContentItem,
  ItemResponses
} from 'kentico-cloud-delivery';
import {storeReferenceDataToBlobStorage} from './external/blobManager';
import {
    DepthParameter,
    getDeliveryClient,
    getPreviewDeliveryClient,
    getQueryConfig
} from './external/kenticoCloudClient';
import {fetchOrderedPlatformNames} from './external/orderedPlatformNames';
import {ZapiSpecification} from './models/zapi_specification';
import {getProcessedData} from './processing/getProcessedData';

const getClient = (operation: ReferenceOperation) =>
  operation === ReferenceOperation.Preview
    ? getPreviewDeliveryClient()
    : getDeliveryClient();

export const processRootItem = async (
    codename: string,
    operation: ReferenceOperation,
    id: string = '',
): Promise<IPreprocessedData> => {
    const response = await getClient(operation)
        .item<ZapiSpecification>(codename)
        .depthParameter(DepthParameter)
        .queryConfig(getQueryConfig())
        .toPromise()
        .catch(error => handleNotFoundItem(error, codename, id));

    await fetchOrderedPlatformNames();

    if (response) {
        return await handleResponse(response, operation);
    }
};

const handleResponse = async (
    response: ItemResponses.ViewContentItemResponse<ZapiSpecification>,
    operation: ReferenceOperation
): Promise<IPreprocessedData> => {
    const linkedItemsAsArray: ContentItem[] = Object
        .keys(response.linkedItems)
        .map(key => response.linkedItems[key]);
    const data = getProcessedData(response.item, linkedItemsAsArray, operation);
    await storeReferenceDataToBlobStorage(data, operation);

    return data;
};

export const handleNotFoundItem = async (
    error: IKenticoCloudError,
    codename: string,
    id: string,
): Promise<void> => {
    if (error.errorCode !== 100) {
        throw error;
    }

    const notFoundItem: IPreprocessedData = {
        items: {},
        operation: ReferenceOperation.Delete,
        zapiSpecificationCodename: codename,
        zapiSpecificationId: id,
    };

    await storeReferenceDataToBlobStorage(notFoundItem, ReferenceOperation.Delete);
};
