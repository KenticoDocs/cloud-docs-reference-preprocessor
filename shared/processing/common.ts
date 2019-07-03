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
import RichTextField = Fields.RichTextField;

type ProcessableObject = ContentItem | ContentItem[] | RichTextField;

type GetData<ProcessedDataModel> = (
    item: ProcessableObject,
    dataBlob?: IPreprocessedData,
    linkedItems?: ContentItem[],
) => Array<IWrappedItem<ProcessedDataModel>>;

export const processItemsInto = <DataModelResult>(getData: GetData<DataModelResult>) =>
    (item: ProcessableObject, dataBlob: IPreprocessedData, linkedItems?: ContentItem[]) => {
        const data = getData(item, dataBlob, linkedItems);
        insertDataIntoBlob(data, dataBlob);
    };

export const getWrappedData = <Data extends ISystemAttributes>(
    dataObject: Data,
    item: ContentItem): IWrappedItem<Data> => ({
    codename: item.system.codename,
    data: dataObject,
});

export const getSystemProperties = (item: ContentItem): ISystemAttributes => ({
    contentType: item.system.type,
    id: item.system.id,
});
