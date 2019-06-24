import { IBlobObject } from '../types/dataModels';
import { Configuration } from './configuration';

const BlobStorage = require('@azure/storage-blob');

export const storeReferenceDataToBlobStorage = async (blobContent: IBlobObject, isPreview: boolean): Promise<void> => {
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
    const blobId = blobContent.data.api_specification.id +
        (isPreview
            ? '-preview'
            : '');
    const blobURL = BlobStorage.BlobURL.fromContainerURL(containerUrl, blobId);
    const blockBlobURL = BlobStorage.BlockBlobURL.fromBlobURL(blobURL);

    const blob = JSON.stringify(blobContent);

    await blockBlobURL.upload(
        BlobStorage.Aborter.none,
        blob,
        blob.length,
    );
};
