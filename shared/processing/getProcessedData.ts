import { ContentItem } from 'kentico-cloud-delivery';
import { Operation } from '../external/models';
import { ZapiSpecification } from '../models/zapi_specification';
import { IPreprocessedData } from '../types/dataModels';
import { processApiSpecification } from './dataGetters';

export const getProcessedData = (
    specifications: ZapiSpecification[],
    linkedItems: ContentItem[],
    operation: Operation,
): IPreprocessedData[] => {
    const allPreprocessedData = [];

    specifications.map((item: ZapiSpecification) => {
        allPreprocessedData.push(getDataObject(item, operation));
        const dataBlob = allPreprocessedData[allPreprocessedData.length - 1];

        processApiSpecification([item], dataBlob, linkedItems);
    });

    return allPreprocessedData;
};

const getDataObject = (item: ZapiSpecification, operation: Operation): IPreprocessedData => ({
    items: {},
    operation,
    zapiSpecificationCodename: item.system.codename,
});
