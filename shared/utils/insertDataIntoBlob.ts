import {
    IPreprocessedData,
    ISystemAttributes,
} from 'cloud-docs-shared-code/reference/preprocessedModels';

export const insertDataIntoBlob = <Data extends ISystemAttributes>(
    item: Data[],
    dataBlob: IPreprocessedData,
): void => {
    if (item.length > 0) {
        for (const dataObject of item) {
            insertItemIntoBlob(dataObject, dataBlob);
        }
    }
};

const insertItemIntoBlob = <Data extends ISystemAttributes>(
    item: Data,
    dataBlob: IPreprocessedData,
): void => {
    if (item && item.codename && item) {
        // @ts-ignore
        dataBlob.items[item.codename] = item;
    }
};
