import { ContentItem, Fields } from 'kentico-cloud-delivery';
import { ZapiCategory } from '../models/zapi__category';
import { ZapiParameter } from '../models/zapi_parameter';
import { ZapiPathOperation } from '../models/zapi_path_operation';
import { ZapiRequestBody } from '../models/zapi_request_body';
import { ZapiResponse } from '../models/zapi_response';
import { ZapiSecurityScheme } from '../models/zapi_security_scheme';
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
    IPathOperation,
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
    getPathOperationsData,
    getSampleItemsData,
    getSamplesItemsData,
    getSecuritySchemeData,
    getServersData,
} from './dataGetters';
import RichTextField = Fields.RichTextField;

const preprocessedData = [];

export const getBlobObject = (item: ZapiSpecification, operation: string | any): IBlobObject =>
    ({
        data: {
            api_specification: getApiSpecificationData(item),
            items: {},
        },
        webhook: operation,
    });

export const getProcessedData = (specifications: ZapiSpecification[], linkedItems: ContentItem[]): IBlobObject[] => {
    specifications.map((item: ZapiSpecification) => {
        preprocessedData.push(getBlobObject(item, 'initialize'));
        const dataBlobIndex = preprocessedData.length - 1;
        const processedData = preprocessedData[dataBlobIndex].data;

        // Linked items
        processItemsOfType<ICategory>(
            getCategoriesData,
            insertDataArrayIntoBlob)
        (
            item.categories, processedData, linkedItems,
        );
        processItemsOfType<IContact>(
            getContactData,
            insertDataIntoBlob)
        (
            item.contact, processedData, linkedItems,
        );
        processItemsOfType<ILicense>(
            getLicenseData,
            insertDataIntoBlob)
        (
            item.license, processedData, linkedItems,
        );

        processItemsOfType<IPathOperation>(
            getPathOperationsData,
            insertDataArrayIntoBlob)
        (
            item.pathOperations, processedData, linkedItems,
        );

        processItemsOfType<ISecurityScheme>(
            getSecuritySchemeData,
            insertDataIntoBlob)
        (
            item.security, processedData,
        );

        processItemsOfType<IServer>(
            getServersData,
            insertDataArrayIntoBlob,
        )(
            item.servers as RichTextField, processedData, linkedItems,
        );

        // Rich Text components/items
        processSharedRichTextComponents(item, processedData, linkedItems);
    });

    return preprocessedData;
};

type ProcessableElement = ContentItem | ContentItem[] | RichTextField;

type GetData<ProcessedDataModel> = (
    item: ProcessableElement,
    dataBlob?: IDataObject,
    linkedItems?: ContentItem[],
) => IDataToInsert<ProcessedDataModel>;

type InsertData<ProcessedDataModel> = (
    data: IDataToInsert<ProcessedDataModel>,
    dataBlob: IDataObject,
) => void;

export const processItemsOfType = <DataModelResult>(
    getData: GetData<DataModelResult>,
    insertData: InsertData<DataModelResult>) =>
    (item: ProcessableElement, dataBlob: IDataObject, linkedItems?: ContentItem[]) => {
        const data = getData(item, dataBlob, linkedItems);
        insertData(data, dataBlob);
    };

type ItemWithRichTextDescription =
    ZapiSpecification
    | ZapiSecurityScheme // Not going to have components?
    | ZapiCategory
    | ZapiPathOperation
    | ZapiParameter
    | ZapiRequestBody // Not going to have components?
    | ZapiResponse

export const processSharedRichTextComponents = (
    item: ItemWithRichTextDescription,
    processedData,
    linkedItems: ContentItem[]) => {
    processItemsOfType<ICallout>(
        getCalloutsData,
        insertDataArrayIntoBlob,
    )(
        item.description, processedData, linkedItems,
    );

    processItemsOfType<ICodeSample>(
        getSampleItemsData,
        insertDataArrayIntoBlob,
    )(
        item.description, processedData, linkedItems,
    );

    processItemsOfType<ICodeSamples>(
        getSamplesItemsData,
        insertDataArrayIntoBlob,
    )(
        item.description, processedData, linkedItems,
    );
};
