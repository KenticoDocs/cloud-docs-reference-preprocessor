import { getRootCodenamesOfItem } from './getRootCodenamesOfItem';

const rootItemType = 'root_item_codename';
const allItems = [{
    content: {
        linkedItemCodenames: [],
        type: 'rich_text',
        value: 'callout content',
    },
    system: {
        codename: 'hello_world',
        type: 'callout',
    },
}, {
    content: {
        linkedItemCodenames: ['hello_world'],
        type: 'rich_text',
    },
    system: {
        codename: 'some_chunk',
        type: 'content_chunk',
    },
}, {
    description: {
        linkedItemCodenames: ['some_chunk'],
        type: 'rich_text',
    },
    system: {
        codename: 'content_management_api',
        type: rootItemType,
    },
}, {
    description: {
        linkedItemCodenames: ['hello_world'],
        type: 'rich_text',
    },
    system: {
        codename: 'delivery_api',
        type: rootItemType,
    },
}];

const allItemsWithCodeSamples = [{
    elements: {
        code_samples: {
            type: 'modular_content',
            value: ['hello_world'],
        },
    },
    system: {
        codename: 'hello_world_samples',
        type: 'code_samples',
    },
}, {
    content: {
        linkedItemCodenames: ['hello_world_samples'],
        type: 'rich_text',
    },
    system: {
        codename: 'code_sample_chunk',
        type: 'content_chunk',
    },
}, {
    description: {
        linkedItemCodenames: ['code_sample_chunk'],
        type: 'rich_text',
    },
    system: {
        codename: 'delivery_api',
        type: rootItemType,
    },
}];

describe('getRootCodenamesOfItem', () => {
    it('returns both root zapi specification items', () => {
        const item = {
            codename: 'hello_world',
            language: 'default',
            type: 'callout',
        };
        const expectedResult = ['delivery_api', 'content_management_api'];

        const actualResult = getRootCodenamesOfItem(item, allItems as any, [rootItemType]);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns root of a nested code_sample item', () => {
        const item = {
            codename: 'hello_world',
            language: 'default',
            type: 'code_sample',
        };
        const expectedResult = ['delivery_api'];

        const actualResult = getRootCodenamesOfItem(item, allItemsWithCodeSamples as any, [rootItemType]);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns an empty array when it finds no root items', () => {
        const item = {
            codename: 'some_codename',
            language: 'default',
            type: 'some_type',
        };
        const expectedResult = [];

        const actualResult = getRootCodenamesOfItem(item, allItemsWithCodeSamples as any, [rootItemType]);

        expect(actualResult).toEqual(expectedResult);
    });
});
