import {
  ContentItem,
  ContentItemSystemAttributes,
  ElementContracts,
  ElementModels,
  Elements,
  ElementType,
  IContentItemConfig,
  IContentItemRawData,
  IContentItemSystemAttributes,
} from 'kentico-cloud-delivery';

import {
  getFromLinkedItems as getLinkedItemByCodename,
  processLinkedItemsElement,
  processMultipleChoiceElement,
  processTaxonomyElement,
} from './processElements';

const date = new Date();

const constructItemConfig = (): IContentItemConfig => ({});

const constructRawData = (): IContentItemRawData => ({
    elements: {}
});

const constructLinkedItemsElement = (items: ContentItem[]): Elements.LinkedItemsElement =>
  new Elements.LinkedItemsElement({
    contentTypeSystem: null as any,
    propertyName: 'y',
    rawElement: {
      name: 'x',
      type: ElementType.ModularContent,
      value: [items.map(m => m.system.codename)]
    }
  }, items);

const constructTextElement = (name: string, value: string): Elements.TextElement =>
  new Elements.TextElement({
    contentTypeSystem: null as any,
    propertyName: name,
    rawElement: {
      name,
      type: ElementType.Text,
      value
    }
  });

const constructTaxonomyElement = (
  name: string,
  value: ElementContracts.ITaxonomyTerm[],
  taxonomyGroup: string
): Elements.TaxonomyElement =>
  new Elements.TaxonomyElement({
    contentTypeSystem: null as any,
    propertyName: name,
    rawElement: {
      name,
      taxonomy_group: taxonomyGroup,
      type: ElementType.Taxonomy,
      value
    }
  });

const constructMultipleChoiceElement = (
  name: string,
  value: ElementContracts.IMultipleChoiceOptionContract[]
): Elements.MultipleChoiceElement =>
  new Elements.MultipleChoiceElement({
    contentTypeSystem: null as any,
    propertyName: name,
    rawElement: {
      name,
      type: ElementType.MultipleChoice,
      value
    }
  });

const createContentItem = (
  elements: { [key: string]: ElementModels.IElement<any> },
  system: IContentItemSystemAttributes
): ContentItem => {
  const item = new ContentItem();
  item.system = new ContentItemSystemAttributes({
    codename: system.codename,
    id: system.id,
    language: system.language,
    lastModified: new Date(system.lastModified),
    name: system.name,
    sitemapLocations: [],
    type: system.type
  });
  item._raw = constructRawData();
  item._config = constructItemConfig();

  Object.assign(item, elements);

  return item;
};

describe('processLinkedItemsElement', () => {
  it('returns codenames of all linked content items in an array', () => {
    const linkedItems: ContentItem[] = [
      createContentItem(
        {
          title: constructTextElement('Title', 'Content Management API')
        },
        {
          codename: 'content_management_api',
          id: '2ced70d5-3b85-44fd-8f45-9d425f43374b',
          language: 'en-US',
          lastModified: date,
          name: 'Content Management API v2',
          sitemapLocations: [],
          type: 'zapi_specification'
        }
      ),
      createContentItem(
        {
          title: constructTextElement('Title', 'Deliver API')
        },
        {
          codename: 'deliver_api',
          id: '2ced70d5-3b85-44fd-8f45-9d425f43374b',
          language: 'en-US',
          lastModified: date,
          name: 'Deliver API',
          sitemapLocations: [],
          type: 'zapi_specification'
        }
      )
    ];
    const linkedItemsElement: Elements.LinkedItemsElement = constructLinkedItemsElement(linkedItems);

    const expectedResult: string[] = ['content_management_api', 'deliver_api'];
    const actualResult: string[] = processLinkedItemsElement(linkedItemsElement);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns an empty array for empty linked items element', () => {
    const linkedItems: ContentItem[] = [];
    const linkedItemsElement: Elements.LinkedItemsElement = constructLinkedItemsElement(linkedItems);
    const expectedResult: string[] = [];

    const actualResult: string[] = processLinkedItemsElement(linkedItemsElement);

    expect(actualResult).toEqual(expectedResult);
  });
});

describe('processTaxonomyElement', () => {
  it('returns names of selected terms of taxonomy element in an array', () => {
    const taxonomyElement: Elements.TaxonomyElement = constructTaxonomyElement(
      'API reference',
      [
        {
          codename: 'content_management_api_v2',
          name: 'Content Management API v2'
        },
        {
          codename: 'delivery_api',
          name: 'Delivery API'
        }
      ],
      'api_reference'
    );

    const expectedResult: string[] = ['Content Management API v2', 'Delivery API'];
    const actualResult: string[] = processTaxonomyElement(taxonomyElement);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns an empty array for empty taxonomyElement', () => {
    const taxonomyElement: Elements.TaxonomyElement = constructTaxonomyElement('API reference', [], 'api_reference');

    const expectedResult: string[] = [];
    const actualResult: string[] = processTaxonomyElement(taxonomyElement);

    expect(actualResult).toEqual(expectedResult);
  });
});

describe('processMultipleChoiceElement', () => {
  it('returns names of selected options of multipleChoiceElement in an array', () => {
    const multipleChoiceElement: Elements.MultipleChoiceElement = constructMultipleChoiceElement('x', [
      {
        codename: 'http',
        name: 'http'
      },
      {
        codename: 'apiKey',
        name: 'apiKey'
      }
    ]);

    const expectedResult: string[] = ['http', 'apiKey'];
    const actualResult: string[] = processMultipleChoiceElement(multipleChoiceElement);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns an empty array for empty multipleChoiceElement', () => {
    const multipleChoiceElement: Elements.MultipleChoiceElement = constructMultipleChoiceElement('x', []);

    const expectedResult: string[] = [];
    const actualResult: string[] = processMultipleChoiceElement(multipleChoiceElement);

    expect(actualResult).toEqual(expectedResult);
  });
});

describe('getFromLinkedItems', () => {
  const linkedItems: ContentItem[] = [
    createContentItem(
      {
        title: constructTextElement('Title', 'Content Management API')
      },
      {
        codename: 'content_management_api',
        id: '2ced70d5-3b85-44fd-8f45-9d425f43374b',
        language: 'en-US',
        lastModified: date,
        name: 'Content Management API v2',
        sitemapLocations: [],
        type: 'zapi_specification'
      }
    ),
    createContentItem(
      {
        title: constructTextElement('Title', 'Deliver API')
      },
      {
        codename: 'deliver_api',
        id: '2ced70d5-3b85-44fd-8f45-9d425f43374b',
        language: 'en-US',
        lastModified: date,
        name: 'Deliver API',
        sitemapLocations: [],
        type: 'zapi_specification'
      }
    )
  ];

  it('returns item with matching codename', () => {
    const itemCodename: string = linkedItems[1].system.codename;
    const expectedResult: ContentItem = linkedItems[1];

    const actualResult: ContentItem = getLinkedItemByCodename(itemCodename, linkedItems);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns item with matching codename', () => {
    const itemCodename: string = 'recommendation_api';

    expect(() => getLinkedItemByCodename(itemCodename, linkedItems)).toThrow();
  });

  it('throws on an empty linked items element', () => {
    const emptyLinkedItems: ContentItem[] = [];
    const itemCodename: string = 'content_management_api';

    expect(() => getLinkedItemByCodename(itemCodename, emptyLinkedItems)).toThrow();
  });
});
