import {
    ContentItem,
    FieldModels,
    Fields,
} from 'kentico-cloud-delivery';

export const processLinkedItemsElement = (linkedItemsElement: ContentItem[]): string[] =>
    linkedItemsElement.map((contentItem: ContentItem) => contentItem.system.codename);

export const processTaxonomyElement = (taxonomyElement: Fields.TaxonomyField): string[] =>
    taxonomyElement.taxonomyTerms.map((term: FieldModels.TaxonomyTerm) => term.name);

export const processMultipleChoiceElement = (multipleChoiceElement: Fields.MultipleChoiceField): string[] =>
    multipleChoiceElement.options.map((option: FieldModels.MultipleChoiceOption) => option.name);

export const getFromLinkedItems = <T extends ContentItem>(codename: string, linkedItems: ContentItem[]): T => {
    const foundItem = linkedItems.find((item: T) => item.system.codename === codename) as T;

    if (foundItem) {
        return foundItem;
    } else {
        throw new Error(`Item with codename ${codename} not found in linked items.`);
    }
};
