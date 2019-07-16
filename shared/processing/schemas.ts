import {
    ICallout,
    IDiscriminator,
    IDiscriminatorMapItem,
    IPreprocessedData,
    IPropertyReferencingASchema,
    ISchemaAllOf,
    ISchemaAnyOf,
    ISchemaArray,
    ISchemaBoolean,
    ISchemaElements,
    ISchemaInteger,
    ISchemaNumber,
    ISchemaObject,
    ISchemaObjectPropertyElements,
    ISchemaOneOf,
    ISchemaString,
} from 'cloud-docs-shared-code/reference/preprocessedModels';
import {
    ContentItem,
    Fields,
} from 'kentico-cloud-delivery';
import { Callout } from '../models/callout';
import { ZapiDiscriminator } from '../models/zapi_discriminator';
import { ZapiDiscriminatorMapItem } from '../models/zapi_discriminator__map_item';
import { ZapiPropertyReferencingASchema } from '../models/zapi_property_referencing_a_schema';
import { ZapiSchemaAllof } from '../models/zapi_schema__allof';
import { ZapiSchemaAnyof } from '../models/zapi_schema__anyof';
import { ZapiSchemaArray } from '../models/zapi_schema__array';
import { ZapiSchemaBoolean } from '../models/zapi_schema__boolean';
import { ZapiSchemaInteger } from '../models/zapi_schema__integer';
import { ZapiSchemaNumber } from '../models/zapi_schema__number';
import { ZapiSchemaObject } from '../models/zapi_schema__object';
import { ZapiSchemaOneof } from '../models/zapi_schema__oneof';
import { ZapiSchemaString } from '../models/zapi_schema__string';
import {
    processLinkedItemsElement,
    processMultipleChoiceElement,
    processTaxonomyElement,
} from '../utils/processElements';
import {
    getItemsDataFromLinkedItems,
    getItemsDataFromRichText,
    getSystemProperties,
    processItems,
} from './common';
import { getCalloutData } from './descriptionComponents';
import RichTextField = Fields.RichTextField;

type ZapiSchemas =
    ZapiSchemaAllof
    | ZapiSchemaAnyof
    | ZapiSchemaArray
    | ZapiSchemaBoolean
    | ZapiSchemaInteger
    | ZapiSchemaNumber
    | ZapiSchemaObject
    | ZapiSchemaOneof
    | ZapiSchemaString
    | ZapiPropertyReferencingASchema;

type ISchemas =
    ISchemaAllOf
    | ISchemaAnyOf
    | ISchemaArray
    | ISchemaBoolean
    | ISchemaInteger
    | ISchemaNumber
    | ISchemaObject
    | ISchemaOneOf
    | ISchemaString
    | IPropertyReferencingASchema;

export const processSchemasFromLinkedItemsElement = (
    items: ContentItem[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromLinkedItems<ZapiSchemas, ISchemas>(getSchemaData),
)(items, dataBlob, linkedItems);

export const processSchemasFromRichTextElement = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromRichText<ZapiSchemas, ISchemas>(getSchemaData),
)(field, dataBlob, linkedItems);

const getSchemaData = (
    schema: ZapiSchemas,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ISchemas => {
    switch (schema.system.type) {
        case 'zapi_schema__allof': {
            return getSchemaAllOfData(schema as ZapiSchemaAllof, dataBlob, linkedItems);
        }
        case 'zapi_schema__anyof': {
            return getSchemaAnyOfData(schema as ZapiSchemaAnyof, dataBlob, linkedItems);
        }
        case 'zapi_schema__array': {
            return getSchemaArrayData(schema as ZapiSchemaArray, dataBlob, linkedItems);
        }
        case 'zapi_schema__boolean': {
            return getSchemaBooleanData(schema as ZapiSchemaBoolean, dataBlob, linkedItems);
        }
        case 'zapi_schema__integer': {
            return getSchemaIntegerData(schema as ZapiSchemaInteger, dataBlob, linkedItems);
        }
        case 'zapi_schema__number': {
            return getSchemaNumberData(schema as ZapiSchemaNumber, dataBlob, linkedItems);
        }
        case 'zapi_schema__object': {
            return getSchemaObjectData(schema as ZapiSchemaObject, dataBlob, linkedItems);
        }
        case 'zapi_schema__oneof': {
            return getSchemaOneOfData(schema as ZapiSchemaOneof, dataBlob, linkedItems);
        }
        case 'zapi_schema__string': {
            return getSchemaStringData(schema as ZapiSchemaString, dataBlob, linkedItems);
        }
        case 'zapi_property_referencing_a_schema': {
            return getPropertyReferencingData(schema as ZapiPropertyReferencingASchema, dataBlob, linkedItems);
        }
        default:
            throw Error(`Unsupported content type (${schema.system.type}) in a schema-related element`);
    }
};

const getSchemaArrayData = (
    schema: ZapiSchemaArray,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ISchemaArray => {
    processSchemasFromRichTextElement(schema.items, dataBlob, linkedItems);
    processCallouts(schema.commonSchemaElementsDescription, dataBlob, linkedItems);

    return {
        ...getSystemProperties(schema),
        ...getSchemaElements(schema),
        apiReference: processTaxonomyElement(schema.apiReference),
        items: schema.items.getHtml(),
        uniqueItems: processMultipleChoiceElement(schema.uniqueitems),
    };
};

const getSchemaAnyOfData = (
    schema: ZapiSchemaAnyof,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ISchemaAnyOf => {
    processSchemasFromLinkedItemsElement(schema.schemas, dataBlob, linkedItems);
    processCallouts(schema.commonSchemaElementsDescription, dataBlob, linkedItems);

    return {
        ...getSystemProperties(schema),
        ...getSchemaObjectPropertyElements(schema),
        ...getSchemaElements(schema),
        apiReference: processTaxonomyElement(schema.apiReference),
        schemas: processLinkedItemsElement(schema.schemas),
    };
};

const getSchemaAllOfData = (
    schema: ZapiSchemaAllof,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ISchemaAllOf => {
    processSchemasFromRichTextElement(schema.schemas, dataBlob, linkedItems);
    processCallouts(schema.commonSchemaElementsDescription, dataBlob, linkedItems);

    return {
        ...getSystemProperties(schema),
        ...getSchemaElements(schema),
        apiReference: processTaxonomyElement(schema.apiReference),
        schemas: schema.items.getHtml(),
    };
};

const getSchemaBooleanData = (
    schema: ZapiSchemaBoolean,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ISchemaBoolean => {
    processCallouts(schema.commonSchemaElementsDescription, dataBlob, linkedItems);

    return {
        ...getSystemProperties(schema),
        ...getSchemaObjectPropertyElements(schema),
        ...getSchemaElements(schema),
        apiReference: processTaxonomyElement(schema.apiReference),
    };
};

const getSchemaIntegerData = (
    schema: ZapiSchemaInteger,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ISchemaInteger => {
    processCallouts(schema.commonSchemaElementsDescription, dataBlob, linkedItems);

    return {
        ...getSystemProperties(schema),
        ...getSchemaObjectPropertyElements(schema),
        ...getSchemaElements(schema),
        acceptedValues: schema.acceptedValues.value,
        apiReference: processTaxonomyElement(schema.apiReference),
        defaultValue: schema.defaultValue.value,
        format: processMultipleChoiceElement(schema.format),
        maximum: schema.maximum.value,
        minimum: schema.minimum.value,

    };
};

const getSchemaNumberData = (
    schema: ZapiSchemaNumber,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ISchemaNumber => {
    processCallouts(schema.commonSchemaElementsDescription, dataBlob, linkedItems);

    return {
        ...getSystemProperties(schema),
        ...getSchemaObjectPropertyElements(schema),
        ...getSchemaElements(schema),
        acceptedValues: schema.acceptedValues.value,
        apiReference: processTaxonomyElement(schema.apiReference),
        format: processMultipleChoiceElement(schema.format),
        maximum: schema.maximum.value,
        minimum: schema.minimum.value,
    };
};

const getSchemaObjectData = (
    schema: ZapiSchemaObject,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ISchemaObject => {
    processSchemasFromRichTextElement(schema.properties, dataBlob, linkedItems);
    processSchemasFromRichTextElement(schema.additionalProperties, dataBlob, linkedItems);
    processCallouts(schema.commonSchemaElementsDescription, dataBlob, linkedItems);

    return {
        ...getSystemProperties(schema),
        ...getSchemaElements(schema),
        additionalProperties: schema.additionalProperties.getHtml(),
        apiReference: processTaxonomyElement(schema.apiReference),
        properties: schema.properties.getHtml(),
        required: schema.required.value,
    };
};

const getSchemaOneOfData = (
    schema: ZapiSchemaOneof,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ISchemaOneOf => {
    processDiscriminators(schema.discriminator, dataBlob, linkedItems);
    processSchemasFromLinkedItemsElement(schema.schemas, dataBlob, linkedItems);
    processCallouts(schema.commonSchemaElementsDescription, dataBlob, linkedItems);

    return {
        ...getSystemProperties(schema),
        ...getSchemaElements(schema),
        apiReference: processTaxonomyElement(schema.apiReference),
        discriminator: schema.discriminator.getHtml(),
        schemas: processLinkedItemsElement(schema.schemas),
    };
};

const getSchemaStringData = (
    schema: ZapiSchemaString,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ISchemaString => {
    processCallouts(schema.commonSchemaElementsDescription, dataBlob, linkedItems);

    return {
        ...getSystemProperties(schema),
        ...getSchemaObjectPropertyElements(schema),
        ...getSchemaElements(schema),
        acceptedValues: schema.acceptedValues.value,
        apiReference: processTaxonomyElement(schema.apiReference),
        defaultValue: schema.defaultValue.value,
        format: schema.format.value,
        maxLength: schema.maxlength.number,
        minLength: schema.minlength.number,
    };
};

const getPropertyReferencingData = (
    item: ZapiPropertyReferencingASchema,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): IPropertyReferencingASchema => {
    processSchemasFromLinkedItemsElement(item.schema, dataBlob, linkedItems);

    return {
        ...getSystemProperties(item),
        name: item.name.value,
        schema: processLinkedItemsElement(item.schema),
    };
};

const getSchemaElements = (item: ContentItem): ISchemaElements => ({
    description: item.commonSchemaElementsDescription.getHtml(),
    example: item.commonSchemaElementsExample.value,
    name: item.commonSchemaElementsName.value,
});

const getSchemaObjectPropertyElements = (item: ContentItem): ISchemaObjectPropertyElements => ({
    nullable: processMultipleChoiceElement(item.commonSchemaObjectPropertyElementsNullable),
    readonly: processMultipleChoiceElement(item.commonSchemaObjectPropertyElementsReadonly),
    writeonly: processMultipleChoiceElement(item.commonSchemaObjectPropertyElementsWriteonly),
});

const processCallouts = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromRichText<Callout, ICallout>(getCalloutData),
)(field, dataBlob, linkedItems);

const processDiscriminators = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromRichText<ZapiDiscriminator, IDiscriminator>(getDiscriminatorData),
)(field, dataBlob, linkedItems);

const getDiscriminatorData = (
    item: ZapiDiscriminator,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): IDiscriminator => {
    if (item.system.type === 'zapi_discriminator') {
        processDiscriminatorMapItems(item.mapping, dataBlob, linkedItems);

        return {
            ...getSystemProperties(item),
            mapping: item.mapping.getHtml(),
            propertyName: item.propertyName.value,
        };
    }
};

const processDiscriminatorMapItems = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromRichText<ZapiDiscriminatorMapItem, IDiscriminatorMapItem>(getDiscriminatorMapItemData),
)(field, dataBlob, linkedItems);

const getDiscriminatorMapItemData = (
    item: ZapiDiscriminatorMapItem,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): IDiscriminatorMapItem => {
    if (item.system.type === 'zapi_discriminator__map_item') {
        processSchemasFromLinkedItemsElement(item.schema, dataBlob, linkedItems);

        return {
            ...getSystemProperties(item),
            discriminatorValue: item.discriminatorValue.value,
            schema: processLinkedItemsElement(item.schema),
        };
    }
};
