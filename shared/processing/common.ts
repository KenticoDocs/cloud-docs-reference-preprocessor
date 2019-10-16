import {ContentItem, Elements} from 'kentico-cloud-delivery';
import {IPreprocessedData, ISystemAttributes} from 'kontent-docs-shared-code/reference/preprocessedModels';

import {insertDataIntoBlob} from '../utils/insertDataIntoBlob';
import {getFromLinkedItems} from '../utils/processElements';

type ProcessableObject = ContentItem | ContentItem[] | Elements.RichTextElement;

type GetData<ProcessedDataModel extends ISystemAttributes> = (
  item: ProcessableObject,
  dataBlob: IPreprocessedData,
  linkedItems: ContentItem[]
) => ProcessedDataModel[];

type GetDataObject<ProcessedDataModel> = (
  item: ProcessableObject,
  dataBlob: IPreprocessedData,
  linkedItems: ContentItem[]
) => ProcessedDataModel;

export const processItems = <DataModelResult extends ISystemAttributes>(getData: GetData<DataModelResult>) => (
  item: ProcessableObject,
  dataBlob: IPreprocessedData,
  linkedItems: ContentItem[]
): void => {
  const data = getData(item, dataBlob, linkedItems);
  insertDataIntoBlob(data, dataBlob);
};

export const getItemsDataFromRichText = <KCItem extends ContentItem, PreprocessedItem extends ISystemAttributes>(
  getDataObject: GetDataObject<PreprocessedItem>
) => (
  richTextElement: Elements.RichTextElement,
  dataBlob: IPreprocessedData,
  linkedItems: ContentItem[]
): PreprocessedItem[] =>
  richTextElement.linkedItemCodenames
    .map(codename => {
      const item: KCItem = getFromLinkedItems<KCItem>(codename, linkedItems);

      return getDataObject(item, dataBlob, linkedItems);
    })
    // Filters out undefined objects - repeating schemas and content chunks
    .filter(dataObject => dataObject);

export const getItemsDataFromLinkedItems = <KCItem extends ContentItem, PreprocessedItem extends ISystemAttributes>(
  getDataObject: GetDataObject<PreprocessedItem>
) => (
  items: ContentItem[],
  dataBlob: IPreprocessedData,
  linkedItems: ContentItem[]
): PreprocessedItem[] =>
  items.map(item => getDataObject(item, dataBlob, linkedItems));

export const getSystemProperties = ({system: {type, id, codename}}: ContentItem): ISystemAttributes => ({
  codename,
  contentType: type,
  id
});
