import {
    IPreprocessedData,
    ReferenceOperation,
} from 'cloud-docs-shared-code/reference/preprocessedModels';
import { ContentItem } from 'kentico-cloud-delivery';
import { ZapiSpecification } from '../models/zapi_specification';
import { processApiSpecification } from './apiSpecification';

export const getProcessedData = (
    specification: ZapiSpecification,
    linkedItems: ContentItem[],
    operation: ReferenceOperation,
): IPreprocessedData => {
    const dataBlob = getDataObject(specification, operation);
    processApiSpecification([specification], dataBlob, linkedItems);

    return dataBlob;
};

const getDataObject = (item: ZapiSpecification, operation: ReferenceOperation): IPreprocessedData => ({
    items: {},
    operation,
    zapiSpecificationCodename: item.system.codename,
    zapiSpecificationId: item.system.id,
});
