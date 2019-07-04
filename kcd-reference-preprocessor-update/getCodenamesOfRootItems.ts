import { ContentItem } from 'kentico-cloud-delivery';
import {
    getDeliveryClient,
    RootItemType,
} from '../shared/external/kenticoCloudClient';
import { IWebhookContentItem } from '../shared/external/models';
import { getRootCodenamesOfSingleItem } from '../shared/utils/rootItemsGetter';

export const getCodenamesOfRootItems = async (items: IWebhookContentItem[]): Promise<Set<string>> => {
    const allItems = await getAllItems();
    const rootCodenames = new Set<string>();

    items.forEach((item) => {
        const roots = getRootCodenamesOfSingleItem(item, allItems, [RootItemType]);
        roots.forEach((codename) => rootCodenames.add(codename));
    });

    return rootCodenames;
};

const getAllItems = async (): Promise<ContentItem[]> => {
    const response = await getDeliveryClient()
        .items()
        .depthParameter(0)
        .getPromise();

    return response.items.concat(response.linkedItems);
};
