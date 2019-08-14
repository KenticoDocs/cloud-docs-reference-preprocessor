import {
    ContentItem,
    ElementModels,
    Elements,
} from 'kentico-cloud-delivery';

export const processLinkedItemsElement = (linkedItemsElement: Elements.LinkedItemsElement): string[] =>
    linkedItemsElement.value.map((contentItem: ContentItem) => contentItem.system.codename);

export const processTaxonomyElement = (taxonomyElement: Elements.TaxonomyElement): string[] =>
    taxonomyElement.value.map((term: ElementModels.TaxonomyTerm) => term.name);

export const processMultipleChoiceElement = (multipleChoiceElement: Elements.MultipleChoiceElement): string[] =>
    multipleChoiceElement.value.map((option: ElementModels.MultipleChoiceOption) => option.name);

export const getFromLinkedItems = <ItemToFind extends ContentItem>(
    codename: string,
    linkedItems: ContentItem[],
): ItemToFind => {
    const foundItem: ItemToFind = linkedItems.find((item) => item.system.codename === codename) as ItemToFind;

    if (foundItem) {
        return foundItem;
    } else {
        throw new Error(`Item with codename '${codename}' was not found in linked items.`);
    }
};
