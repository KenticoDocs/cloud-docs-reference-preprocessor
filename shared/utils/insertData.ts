import {
    IPreprocessedData,
    IWrappedItem,
} from '../types/dataModels';

export const insertDataIntoBlob = (item: Array<IWrappedItem<any>>, dataBlob: IPreprocessedData): void => {
    if (item.length > 0) {
        for (const dataObject of item) {
            insertItemIntoBlob(dataObject, dataBlob);
        }
    }
};

const insertItemIntoBlob = (item: IWrappedItem<any>, dataBlob: IPreprocessedData): void => {
    if (item && item.codename && item.data) {
        dataBlob.items[item.codename] = item.data;
    }
};
