import { ContentItem } from 'kentico-cloud-delivery';
import { Operation } from '../external/models';
import { ZapiSpecification } from '../models/zapi_specification';
import { processApiSpecification } from './apiSpecification';
import { IPreprocessedData } from './processedDataModels';

export const getProcessedData = (
    specifications: ZapiSpecification[],
    linkedItems: ContentItem[],
    operation: Operation,
): IPreprocessedData[] =>
    specifications.map((item: ZapiSpecification) => {
        const dataBlob = getDataObject(item, operation);
        processApiSpecification([item], dataBlob, linkedItems);

        return dataBlob;
    });

const getDataObject = (item: ZapiSpecification, operation: Operation): IPreprocessedData => ({
    items: {},
    operation,
    zapiSpecificationCodename: item.system.codename,
});
