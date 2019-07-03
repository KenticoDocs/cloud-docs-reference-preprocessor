import { ContentItem } from 'kentico-cloud-delivery';
import { Operation } from '../external/models';
import { ZapiSpecification } from '../models/zapi_specification';
import {
    IPreprocessedData,
    IZapiSpecification,
} from '../types/dataModels';
import { processItemsInto } from './common';
import { getApiSpecificationData } from './dataGetters';

export class DataProcessor {
    private allPreprocessedData = [];

    public getProcessedData = (
        specifications: ZapiSpecification[],
        linkedItems: ContentItem[],
        operation: Operation,
    ): IPreprocessedData[] => {
        specifications.map((item: ZapiSpecification) => {
            this.allPreprocessedData.push(this.getDataObject(item, operation));
            const dataBlob = this.allPreprocessedData[this.allPreprocessedData.length - 1];

            processItemsInto<IZapiSpecification>(getApiSpecificationData)(item, dataBlob, linkedItems);
        });

        return this.allPreprocessedData;
    };

    private getDataObject = (item: ZapiSpecification, operation: Operation): IPreprocessedData => ({
        items: {},
        operation,
        zapiSpecificationCodename: item.system.codename,
    });
}
