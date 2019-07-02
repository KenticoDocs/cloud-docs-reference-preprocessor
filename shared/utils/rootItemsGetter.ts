import { ContentItem } from 'kentico-cloud-delivery';
import { IWebhookContentItem } from '../external/models';

interface IContext {
    readonly visitedItems: string[],
    readonly rootItemCodenames: string[],
    readonly newItemsToVisit: ContentItem[],
    readonly allItems: ContentItem[],
}

export const getRootCodenamesOfSingleItem = (item: IWebhookContentItem, allItems: ContentItem[]): string[] => {
    if (item.type === 'zapi_specification') {
        return [item.codename];
    }

    return getRootParents(item.codename, allItems);
};

const getRootParents = (codename: string, allItems: ContentItem[]): string[] => {
    let itemsToVisit = getDirectParents(codename, allItems);
    const visitedItems = [];
    const rootItemCodenames = [];

    while (itemsToVisit.length > 0) {
        const newItemsToVisit = [];

        itemsToVisit.forEach((item) =>
            processItem(item, { visitedItems, rootItemCodenames, newItemsToVisit, allItems }));

        itemsToVisit = newItemsToVisit;
    }

    return rootItemCodenames;
};

const processItem = (itemToProcess: ContentItem, context: IContext): void => {
    const itemCodename = itemToProcess.system.codename;

    if (context.visitedItems.includes(itemCodename)) {
        return;
    }
    context.visitedItems.push(itemCodename);

    if (itemToProcess.system.type === 'zapi_specification') {
        context.rootItemCodenames.push(itemCodename);
    } else {
        const parents = getDirectParents(itemCodename, context.allItems);
        parents.forEach((item) => context.newItemsToVisit.push(item));
    }
};

const getDirectParents = (codename: string, allItems: ContentItem[]): ContentItem[] =>
    allItems.filter((item) =>
        checkAllItemsInRichTextFields(item, codename) ||
        checkAllItemsInLinkedItemsFields(item, codename));

const checkAllItemsInRichTextFields = (item: ContentItem, codename: string): boolean => {
    let isParent = false;

    for (const key in item) {
        if (item.hasOwnProperty(key)) {
            const element = item[key];
            if (element.type && element.type === 'rich_text') {
                isParent = isParent || element.linkedItemCodenames.includes(codename);
            }
        }
    }

    return isParent;
};

const checkAllItemsInLinkedItemsFields = (item: ContentItem, codename: string): boolean => {
    const itemElements = item.elements;
    let isParent = false;

    for (const key in itemElements) {
        if (itemElements.hasOwnProperty(key)) {
            const element = itemElements[key];
            if (element.type && element.type === 'modular_content') {
                isParent = isParent || element.value.includes(codename);
            }
        }
    }

    return isParent;
};
