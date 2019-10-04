import {
    Aborter,
    BlockBlobURL,
    ContainerURL,
    Pipeline,
    ServiceURL,
    SharedKeyCredential,
    StorageURL,
} from '@azure/storage-blob';
import {
  Configuration,
  IPreprocessedData,
  ReferenceOperation
} from 'cloud-docs-shared-code';

export const storeReferenceDataToBlobStorage = async (
  dataBlob: IPreprocessedData,
  operation: ReferenceOperation
): Promise<void> => {
  const containerUrl: ContainerURL = getContainerUrl();
  const blobId: string = getBlobId(dataBlob.zapiSpecificationCodename, operation);
  const blobURL: BlockBlobURL = BlockBlobURL.fromContainerURL(containerUrl, blobId);
  const blockBlobURL: BlockBlobURL = BlockBlobURL.fromBlobURL(blobURL);

  const blob: string = JSON.stringify(dataBlob);

  await blockBlobURL.upload(Aborter.none, blob, blob.length);
};

const getContainerUrl = (): ContainerURL => {
  const sharedKeyCredential = new SharedKeyCredential(
    Configuration.keys.azureAccountName,
    Configuration.keys.azureStorageKey
  );
  const pipeline: Pipeline = StorageURL.newPipeline(sharedKeyCredential);
  const serviceUrl: ServiceURL = new ServiceURL(
    `https://${Configuration.keys.azureAccountName}.blob.core.windows.net`,
    pipeline
  );

  return ContainerURL.fromServiceURL(serviceUrl, Configuration.keys.azureContainerName);
};

export const getBlobId = (codename: string, operation: ReferenceOperation): string => {
  switch (operation) {
    case ReferenceOperation.Update:
    case ReferenceOperation.Delete:
    case ReferenceOperation.Initialize: {
      return codename;
    }
    case ReferenceOperation.Preview: {
      return `${codename}-preview`;
    }
    default: {
      throw Error(`Invalid operation '${operation}'`);
    }
  }
};
