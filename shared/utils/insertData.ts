import {
    IPreprocessedData,
    ISystemAttributes,
    IWrappedItem,
} from '../types/dataModels';

export const insertDataIntoBlob = <Data extends ISystemAttributes>(
    item: Array<IWrappedItem<Data>>,
    dataBlob: IPreprocessedData,
): void => {
    if (item.length > 0) {
        for (const dataObject of item) {
            insertItemIntoBlob(dataObject, dataBlob);
        }
    }
};

const insertItemIntoBlob = <Data extends ISystemAttributes>(
    item: IWrappedItem<Data>,
    dataBlob: IPreprocessedData,
): void => {
    if (item && item.codename && item.data) {
        dataBlob.items[item.codename] = item.data;
    }
};
