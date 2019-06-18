import { FieldType } from 'kentico-cloud-delivery';
import {
    getFromLinkedItems,
    processLinkedItemsElement,
    processMultipleChoiceElement,
    processTaxonomyElement,
} from './helpers';

const date = new Date();

describe('processLinkedItemsElement', () => {
    it('returns codenames of all linked content items in an array', () => {
        const linkedItemsElement = [
            {
                elements: {
                    title: {
                        name: 'Title',
                        type: 'text',
                        value: 'Content Management API',
                    },
                },
                system: {
                    codename: 'content_management_api',
                    id: '2ced70d5-3b85-44fd-8f45-9d425f43374b',
                    language: 'en-US',
                    lastModified: date,
                    name: 'Content Management API v2',
                    sitemapLocations: [],
                    type: 'zapi_specification',
                },
            }, {
                elements: {
                    title: {
                        name: 'Title',
                        type: 'text',
                        value: 'Deliver API',
                    },
                },
                system: {
                    codename: 'deliver_api',
                    id: '2ced70d5-3b85-44fd-8f45-9d425f43374b',
                    language: 'en-US',
                    lastModified: date,
                    name: 'Deliver API',
                    sitemapLocations: [],
                    type: 'zapi_specification',
                },
            },
        ];
        const expectedResult = [
            'content_management_api',
            'deliver_api',
        ];

        const actualResult = processLinkedItemsElement(linkedItemsElement);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns an empty array for empty linked items element', () => {
        const linkedItemsElement = [];
        const expectedResult = [];

        const actualResult = processLinkedItemsElement(linkedItemsElement);

        expect(actualResult).toEqual(expectedResult);
    });
});

describe('processTaxonomyElement', () => {
    it('returns names of selected terms of taxonomy element in an array', () => {
        const taxonomyElement = {
            name: 'API reference',
            taxonomyGroup: 'api_reference',
            taxonomyTerms: [
                {
                    codename: 'content_management_api_v2',
                    name: 'Content Management API v2',
                }, {
                    codename: 'delivery_api',
                    name: 'Delivery API',
                },
            ],
            type: FieldType.Taxonomy,
            value: {},
        };
        const expectedResult = [
            'Content Management API v2',
            'Delivery API',
        ];

        const actualResult = processTaxonomyElement(taxonomyElement);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns an empty array for empty taxonomyElement', () => {
        const taxonomyElement = {
            name: 'API reference',
            taxonomyGroup: 'api_reference',
            taxonomyTerms: [],
            type: FieldType.Taxonomy,
            value: {},
        };
        const expectedResult = [];

        const actualResult = processTaxonomyElement(taxonomyElement);

        expect(actualResult).toEqual(expectedResult);
    });
});

describe('processMultipleChoiceElement', () => {
    it('returns names of selected options of multipleChoiceElement in an array', () => {
        const multipleChoiceElement = {
            name: 'Type',
            options: [
                {
                    codename: 'http',
                    name: 'http',
                }, {
                    codename: 'apiKey',
                    name: 'apiKey',
                },
            ],
            type: FieldType.MultipleChoice,
            value: [],
        };
        const expectedResult = [
            'http',
            'apiKey',
        ];

        const actualResult = processMultipleChoiceElement(multipleChoiceElement);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns an empty array for empty multipleChoiceElement', () => {
        const multipleChoiceElement = {
            name: 'Type',
            options: [],
            type: FieldType.MultipleChoice,
            value: [],
        };
        const expectedResult = [];

        const actualResult = processMultipleChoiceElement(multipleChoiceElement);

        expect(actualResult).toEqual(expectedResult);
    });
});

describe('getFromLinkedItems', () => {
    const linkedItems = [
        {
            elements: {
                title: {
                    name: 'Title',
                    type: 'text',
                    value: 'Content Management API',
                },
            },
            system: {
                codename: 'content_management_api',
                id: '2ced70d5-3b85-44fd-8f45-9d425f43374b',
                language: 'en-US',
                lastModified: date,
                name: 'Content Management API v2',
                sitemapLocations: [],
                type: 'zapi_specification',
            },
        }, {
            elements: {
                title: {
                    name: 'Title',
                    type: 'text',
                    value: 'Deliver API',
                },
            },
            system: {
                codename: 'deliver_api',
                id: '2ced70d5-3b85-44fd-8f45-9d425f43374b',
                language: 'en-US',
                lastModified: date,
                name: 'Deliver API',
                sitemapLocations: [],
                type: 'zapi_specification',
            },
        },
    ];

    it('returns item with matching codename', () => {
        const itemCodename = linkedItems[1].system.codename;
        const expectedResult = linkedItems[1];

        const actualResult = getFromLinkedItems(itemCodename, linkedItems);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns item with matching codename', () => {
        const itemCodename = 'recommendation_api';

        expect(() => getFromLinkedItems(itemCodename, linkedItems)).toThrow();
    });

    it('throws on an empty linked items element', () => {
        const emptyLinkedItems = [];
        const itemCodename = 'content_management_api';

        expect(() => getFromLinkedItems(itemCodename, emptyLinkedItems)).toThrow();
    });
});
