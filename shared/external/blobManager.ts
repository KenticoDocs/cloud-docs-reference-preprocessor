import { IPreprocessedData } from '../types/dataModels';
import { Configuration } from './configuration';
import { Operation } from './models';

const BlobStorage = require('@azure/storage-blob');

export const storeReferenceDataToBlobStorage = async (
    dataBlob: IPreprocessedData,
    operation: Operation,
): Promise<void> => {
    const sharedKeyCredential = new BlobStorage.SharedKeyCredential(
        Configuration.keys.azureStorageAccountName,
        Configuration.keys.azureStorageKey,
    );
    const pipeline = BlobStorage.StorageURL.newPipeline(sharedKeyCredential);
    const serviceUrl = new BlobStorage.ServiceURL(
        `https://${Configuration.keys.azureStorageAccountName}.blob.core.windows.net`,
        pipeline,
    );
    const containerUrl = BlobStorage.ContainerURL.fromServiceURL(serviceUrl, Configuration.keys.azureContainerName);
    const blobId = getBlobId(dataBlob.zapiSpecificationCodename, operation);
    const blobURL = BlobStorage.BlobURL.fromContainerURL(containerUrl, blobId);
    const blockBlobURL = BlobStorage.BlockBlobURL.fromBlobURL(blobURL);

    const blob = JSON.stringify(dataBlob);

    await blockBlobURL.upload(
        BlobStorage.Aborter.none,
        blob,
        blob.length,
    );
};

const getBlobId = (codename: string, operation: Operation): string => {
    switch (operation) {
        case Operation.Update:
        case Operation.Initialize: {
            return codename;
        }
        case Operation.Preview: {
            return `${codename}-preview`;
        }
        default: {
            return '';
        }
    }
};
