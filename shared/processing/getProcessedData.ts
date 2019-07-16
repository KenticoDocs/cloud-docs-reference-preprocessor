import {
    IPreprocessedData,
    ReferenceOperation,
} from 'cloud-docs-shared-code/reference/preprocessedModels';
import { ContentItem } from 'kentico-cloud-delivery';
import { ZapiSpecification } from '../models/zapi_specification';
import { processApiSpecification } from './apiSpecification';

export const getProcessedData = (
    specifications: ZapiSpecification[],
    linkedItems: ContentItem[],
    operation: ReferenceOperation,
): IPreprocessedData[] =>
    specifications.map((item: ZapiSpecification) => {
        const dataBlob = getDataObject(item, operation);
        processApiSpecification([item], dataBlob, linkedItems);

        return dataBlob;
    });

const getDataObject = (item: ZapiSpecification, operation: ReferenceOperation): IPreprocessedData => ({
    items: {},
    operation,
    zapiSpecificationCodename: item.system.codename,
});
