import { getRootCodenamesOfItem, IWebhookContentItem } from 'cloud-docs-shared-code';
import { ContentItem, ItemResponses } from 'kentico-cloud-delivery';
import { getDeliveryClient, RootItemType } from '../shared/external/kenticoCloudClient';

export const getCodenamesOfRootItems = async (items: IWebhookContentItem[]): Promise<Set<string>> => {
  const allItems: ContentItem[] = await getAllItems();
  const rootCodenames: Set<string> = new Set<string>();

  items.forEach(item => {
    const rootCodenamesOfItem: string[] = getRootCodenamesOfItem(item, allItems, [RootItemType]);
    rootCodenamesOfItem.forEach(codename => rootCodenames.add(codename));
  });

  return rootCodenames;
};

const getAllItems = async (): Promise<ContentItem[]> => {
  const response: ItemResponses.ListContentItemsResponse = await getDeliveryClient()
    .items()
    .depthParameter(0)
    .toPromise();

  const linkedItemsAsArray: ContentItem[] = Object.keys(response.linkedItems).map(
    key => response.linkedItems[key]
  );

  return response.items.concat(linkedItemsAsArray);
};
