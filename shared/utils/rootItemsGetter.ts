import {
    ContentItem,
    FieldType,
} from 'kentico-cloud-delivery';
import { IWebhookContentItem } from '../external/models';

interface IContext {
    readonly visitedItems: string[],
    readonly rootItemCodenames: string[],
    readonly newItemsToVisit: ContentItem[],
    readonly allItems: ContentItem[],
}

export const getRootCodenamesOfSingleItem = (
    item: IWebhookContentItem,
    allItems: ContentItem[],
    rootItemTypes: string[],
): string[] => {
    if (rootItemTypes.includes(item.type)) {
        return [item.codename];
    }

    return getRootParents(item.codename, allItems, rootItemTypes);
};

const getRootParents = (codename: string, allItems: ContentItem[], rootItemTypes: string[]): string[] => {
    let itemsToVisit = getDirectParents(codename, allItems);
    const visitedItems = [];
    const rootItemCodenames = [];

    while (itemsToVisit.length > 0) {
        const newItemsToVisit = [];

        itemsToVisit.forEach((item) =>
            processItem(
                item,
                rootItemTypes,
                {
                    allItems,
                    newItemsToVisit,
                    rootItemCodenames,
                    visitedItems,
                }));

        itemsToVisit = newItemsToVisit;
    }

    return rootItemCodenames;
};

const processItem = (itemToProcess: ContentItem, rootItemTypes: string[], context: IContext): void => {
    const itemCodename = itemToProcess.system.codename;

    if (context.visitedItems.includes(itemCodename)) {
        return;
    }
    context.visitedItems.push(itemCodename);

    if (rootItemTypes.includes(itemToProcess.system.type)) {
        context.rootItemCodenames.push(itemCodename);
    } else {
        const parents = getDirectParents(itemCodename, context.allItems);
        parents.forEach((item) => context.newItemsToVisit.push(item));
    }
};

const getDirectParents = (codename: string, allItems: ContentItem[]): ContentItem[] =>
    allItems.filter((item) => checkAllItemsInElements(item, codename));

const checkAllItemsInElements = (parentItem: ContentItem, codename: string): boolean => {
    const itemElements = parentItem.elements;

    const isInRichTextElement = isInElement(parentItem, codename, FieldType.RichText);
    const isInLinkedItemsElement =
        itemElements
            ? isInElement(itemElements as ContentItem, codename, FieldType.ModularContent)
            : false;

    return isInLinkedItemsElement || isInRichTextElement;
};

const isInElement = (parentItem: ContentItem, codename: string, fieldType: FieldType): boolean =>
    Object
        .keys(parentItem)
        .map((key) => {
            const element = parentItem[key];
            const itemsInElement = element.linkedItemCodenames
                ? element.linkedItemCodenames
                : element.value;

            return (element.type && element.type === fieldType) && itemsInElement.includes(codename);
        })
        .reduce((accumulator, current) => accumulator || current, false);
