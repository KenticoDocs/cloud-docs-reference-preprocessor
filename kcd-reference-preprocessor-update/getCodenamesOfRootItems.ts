import {
    getRootCodenamesOfItem,
    IWebhookContentItem,
} from 'cloud-docs-shared-code';
import { ContentItem } from 'kentico-cloud-delivery';
import {
    getDeliveryClient,
    RootItemType,
} from '../shared/external/kenticoCloudClient';

export const getCodenamesOfRootItems = async (items: IWebhookContentItem[]): Promise<Set<string>> => {
    const allItems = await getAllItems();
    const rootCodenames = new Set<string>();

    items.forEach((item) => {
        const roots = getRootCodenamesOfItem(item, allItems, [RootItemType]);
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
