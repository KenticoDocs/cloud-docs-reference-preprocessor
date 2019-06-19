import { ContentItem } from 'kentico-cloud-delivery';
import { ZapiSpecification } from '../models/zapi_specification';
import {
    IBlobObject,
    ICallout,
    ICategory,
    ICodeSample,
    ICodeSamples,
    IContact,
    IDataObject,
    IDataToInsert,
    ILicense,
    IPath,
    ISecurityScheme,
    IServer,
} from '../types/dataModels';
import { insertDataArrayIntoBlob, insertDataIntoBlob } from '../utils/helpers';
import {
    getApiSpecificationData,
    getCalloutsData,
    getCategoriesData,
    getContactData,
    getLicenseData,
    getPathsData,
    getSampleItemsData,
    getSamplesItemsData,
    getSecuritySchemeData,
    getServersData,
} from './dataGetters';

const preprocessedData = [];

export const getBlobObject = (operation: string | any): IBlobObject =>
    ({
        data: {
            api_specification: {},
            items: {},
        },
        webhook: operation,
    });

export const getProcessedData = (specifications: ZapiSpecification[], linkedItems: ContentItem[]): IBlobObject[] => {
    specifications.map((item: ZapiSpecification) => {
        preprocessedData.push(getBlobObject('initialize'));
        const dataBlobIndex = preprocessedData.length - 1;
        const processedData = preprocessedData[dataBlobIndex].data;

        processedData.api_specification = getApiSpecificationData(item);

        // Linked items
        processItemsOfType<ICategory, ZapiSpecification>(
            getCategoriesData, insertDataArrayIntoBlob)(item, processedData, linkedItems);
        processItemsOfType<IContact, ZapiSpecification>(
            getContactData, insertDataIntoBlob)(item, processedData, linkedItems);
        processItemsOfType<ILicense, ZapiSpecification>(
            getLicenseData, insertDataIntoBlob)(item, processedData, linkedItems);

        processItemsOfType<IPath, ZapiSpecification>(
            getPathsData, insertDataArrayIntoBlob)(item, processedData, linkedItems);

        // processSecurityScheme(item, processedData);
        processItemsOfType<ISecurityScheme, ZapiSpecification>(
            getSecuritySchemeData, insertDataIntoBlob)(item, processedData);

        // Rich Text components/items
        processSharedRichTextComponents(item, processedData, linkedItems);
        processItemsOfType<IServer, ZapiSpecification>(
            getServersData, insertDataArrayIntoBlob)(item, processedData, linkedItems);
    });

    return preprocessedData;
};

export const processItemsOfType = <ProcessedDataModel, ItemToProcess>(
    getData: (item: ItemToProcess, dataBlob?: IDataObject, linkedItems?: ContentItem[]) => IDataToInsert<ProcessedDataModel>,
    insertData: (data: IDataToInsert<ProcessedDataModel>, dataBlob: IDataObject) => void) =>
    (item: ItemToProcess, dataBlob: IDataObject, linkedItems?: ContentItem[]) => {
        const data = getData(item, dataBlob, linkedItems);
        insertData(data, dataBlob);
    };

// TODO: Item bude jeden z tych, ktore maju description (TYPE nebude any)
// TODO: Check ci je v kazdom usingu naozaj vsade pouzity description
export const processSharedRichTextComponents = (item: any, processedData, linkedItems: ContentItem[]) => {
    processItemsOfType<ICallout, any>(getCalloutsData, insertDataArrayIntoBlob)(item, processedData, linkedItems);
    processItemsOfType<ICodeSample, any>(getSampleItemsData, insertDataArrayIntoBlob)(item, processedData, linkedItems);
    processItemsOfType<ICodeSamples, any>(getSamplesItemsData, insertDataArrayIntoBlob)(item, processedData, linkedItems);
};
