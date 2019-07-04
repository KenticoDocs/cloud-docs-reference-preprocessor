import {
    ContentItem,
    Fields,
} from 'kentico-cloud-delivery';
import {
    IPreprocessedData,
    ISystemAttributes,
    IWrappedItem,
} from '../types/dataModels';
import { insertDataIntoBlob } from '../utils/insertData';
import { getFromLinkedItems } from '../utils/processElements';
import RichTextField = Fields.RichTextField;

type ProcessableObject = ContentItem | ContentItem[] | RichTextField;

type GetData<ProcessedDataModel extends ISystemAttributes> = (
    item: ProcessableObject,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
) => Array<IWrappedItem<ProcessedDataModel>>;

type GetDataObject<ProcessedDataModel> = (
    item: ProcessableObject,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
) => ProcessedDataModel;

export const processItemsInto = <DataModelResult extends ISystemAttributes>(getData: GetData<DataModelResult>) =>
    (item: ProcessableObject, dataBlob: IPreprocessedData, linkedItems: ContentItem[]): void => {
        const data = getData(item, dataBlob, linkedItems);
        insertDataIntoBlob(data, dataBlob);
    };

export const getItemsDataFromRichText = <KCItem extends ContentItem, PreprocessedItem extends ISystemAttributes>
(getDataObject: GetDataObject<PreprocessedItem>) => (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): Array<IWrappedItem<PreprocessedItem>> =>
    field.linkedItemCodenames.map((codename) => {
        const item = getFromLinkedItems<KCItem>(codename, linkedItems);

        return getWrappedData<PreprocessedItem>(getDataObject(item, dataBlob, linkedItems), item);
    });

export const getItemsDataFromLinkedItems = <KCItem extends ContentItem, PreprocessedItem extends ISystemAttributes>
(getDataObject: GetDataObject<PreprocessedItem>) => (
    items: ContentItem[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): Array<IWrappedItem<PreprocessedItem>> =>
    items.map((item) =>
        getWrappedData<PreprocessedItem>(getDataObject(item, dataBlob, linkedItems), item));

export const getWrappedData = <Data extends ISystemAttributes>(
    dataObject: Data,
    item: ContentItem,
): IWrappedItem<Data> => ({
    codename: item.system.codename,
    data: dataObject,
});

export const getSystemProperties = (item: ContentItem): ISystemAttributes => ({
    contentType: item.system.type,
    id: item.system.id,
});
