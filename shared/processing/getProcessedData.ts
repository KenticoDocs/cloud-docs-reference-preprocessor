import { ContentItem, Fields } from 'kentico-cloud-delivery';
import { Operation } from '../external/models';
import { ZapiSpecification } from '../models/zapi_specification';
import {
    ICallout,
    ICodeSample,
    ICodeSamples,
    IDataToInsert,
    IImage,
    IPreprocessedData,
    IZapiSpecification,
} from '../types/dataModels';
import { insertDataArrayIntoBlob, insertDataIntoBlob } from '../utils/helpers';
import {
    getApiSpecificationData,
    getCalloutsData,
    getImagesData,
    getSampleItemsData,
    getSamplesItemsData,
} from './dataGetters';
import RichTextField = Fields.RichTextField;

const allPreprocessedData = [];

export const getDataObject = (item: ZapiSpecification, operation: Operation): IPreprocessedData =>
    ({
        items: {},
        operation,
        zapiSpecificationCodename: item.system.codename,
    });

export const getProcessedData = (specifications: ZapiSpecification[], linkedItems: ContentItem[], operation: Operation): IPreprocessedData[] => {
    specifications.map((item: ZapiSpecification) => {
        allPreprocessedData.push(getDataObject(item, operation));
        const dataBlob = allPreprocessedData[allPreprocessedData.length - 1];

        processItemsOfType<IZapiSpecification>(
            getApiSpecificationData,
            insertDataIntoBlob,
        )(item, dataBlob, linkedItems);
    });

    return allPreprocessedData;
};

type ProcessableElement = ContentItem | ContentItem[] | RichTextField;

type GetData<ProcessedDataModel> = (
    item: ProcessableElement,
    dataBlob?: IPreprocessedData,
    linkedItems?: ContentItem[],
) => IDataToInsert<ProcessedDataModel>;

type InsertData<ProcessedDataModel> = (
    data: IDataToInsert<ProcessedDataModel>,
    dataBlob: IPreprocessedData,
) => void;

export const processItemsOfType = <DataModelResult>(
    getData: GetData<DataModelResult>,
    insertData: InsertData<DataModelResult>) =>
    (item: ProcessableElement, dataBlob: IPreprocessedData, linkedItems?: ContentItem[]) => {
        const data = getData(item, dataBlob, linkedItems);
        insertData(data, dataBlob);
    };

export const processSharedRichTextComponents = (
    field: RichTextField,
    processedData,
    linkedItems: ContentItem[]) => {
    processItemsOfType<ICallout>(
        getCalloutsData,
        insertDataArrayIntoBlob)
    (field, processedData, linkedItems);

    processItemsOfType<ICodeSample>(
        getSampleItemsData,
        insertDataArrayIntoBlob)
    (field, processedData, linkedItems);

    processItemsOfType<ICodeSamples>(
        getSamplesItemsData,
        insertDataArrayIntoBlob)
    (field, processedData, linkedItems);

    processItemsOfType<IImage>(
        getImagesData,
        insertDataArrayIntoBlob)
    (field, processedData, linkedItems);
};
