import {
    ContentItem,
    Fields,
} from 'kentico-cloud-delivery';
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
    ISchemas,
    ISchemaString,
    ZapiSchemas,
} from '../types/dataModels';
import {
    processLinkedItemsElement,
    processMultipleChoiceElement,
    processTaxonomyElement,
} from '../utils/processElements';
import {
    getItemsDataFromLinkedItems,
    getItemsDataFromRichText,
    getSystemProperties,
    processItemsInto,
} from './common';
import RichTextField = Fields.RichTextField;

export const processSchemasFromLinkedItemsElement = (
    items: ContentItem[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItemsInto<ISchemas>
(getItemsDataFromLinkedItems<ZapiSchemas, ISchemas>(getSchemaData))
(items, dataBlob, linkedItems);

export const processSchemasFromRichTextElement = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItemsInto<ISchemas>
(getItemsDataFromRichText<ZapiSchemas, ISchemas>(getSchemaData))
(field, dataBlob, linkedItems);

const getSchemaData = (
    schema: ZapiSchemas,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ISchemas => {
    switch (schema.system.type) {
        case 'zapi_schema__array': {
            processSchemasFromRichTextElement(schema.items, dataBlob, linkedItems);

            return getSchemaArrayData(schema as ZapiSchemaArray);
        }
        case 'zapi_schema__anyof': {
            processSchemasFromLinkedItemsElement(schema.schemas, dataBlob, linkedItems);

            return getSchemaAnyOfData(schema as ZapiSchemaAnyof);
        }
        case 'zapi_schema__allof': {
            processSchemasFromRichTextElement(schema.schemas, dataBlob, linkedItems);

            return getSchemaAllOfData(schema as ZapiSchemaAllof);
        }
        case 'zapi_schema__boolean': {
            return getSchemaBooleanData(schema as ZapiSchemaBoolean);
        }
        case 'zapi_schema__integer': {
            return getSchemaIntegerData(schema as ZapiSchemaInteger);
        }
        case 'zapi_schema__number': {
            return getSchemaNumberData(schema as ZapiSchemaNumber);
        }
        case 'zapi_schema__object': {
            processSchemasFromRichTextElement(schema.properties, dataBlob, linkedItems);
            processSchemasFromLinkedItemsElement(schema.additionalProperties, dataBlob, linkedItems);

            return getSchemaObjectData(schema as ZapiSchemaObject);
        }
        case 'zapi_schema__oneof': {
            processDiscriminators(schema.discriminator, dataBlob, linkedItems);
            processSchemasFromLinkedItemsElement(schema.schemaas, dataBlob, linkedItems);

            return getSchemaOneOfData(schema as ZapiSchemaOneof);
        }
        case 'zapi_schema__string': {
            return getSchemaStringData(schema as ZapiSchemaString);
        }
        case 'zapi_property_referencing_a_schema': {
            processSchemasFromLinkedItemsElement(schema.schema, dataBlob, linkedItems);

            return getPropertyReferencingData(schema as ZapiPropertyReferencingASchema);
        }
        default:
            throw Error(`Unsupported content type (${schema.system.type}) in a schema-related element`);
    }
};

const getSchemaArrayData = (schema: ZapiSchemaArray): ISchemaArray => ({
    ...getSystemProperties(schema),
    ...getSchemaElements(schema),
    apiReference: processTaxonomyElement(schema.apiReference),
    items: schema.items.getHtml(),
    uniqueItems: processMultipleChoiceElement(schema.uniqueitems),
});

const getSchemaAnyOfData = (schema: ZapiSchemaAnyof): ISchemaAnyOf => ({
    ...getSystemProperties(schema),
    ...getSchemaObjectPropertyElements(schema),
    ...getSchemaElements(schema),
    apiReference: processTaxonomyElement(schema.apiReference),
    schemas: processLinkedItemsElement(schema.schemas),
});

const getSchemaAllOfData = (schema: ZapiSchemaAllof): ISchemaAllOf => ({
    ...getSystemProperties(schema),
    ...getSchemaElements(schema),
    apiReference: processTaxonomyElement(schema.apiReference),
    schemas: schema.items.getHtml(),
});

const getSchemaBooleanData = (schema: ZapiSchemaBoolean): ISchemaBoolean => ({
    ...getSystemProperties(schema),
    ...getSchemaObjectPropertyElements(schema),
    ...getSchemaElements(schema),
    apiReference: processTaxonomyElement(schema.apiReference),
});

const getSchemaIntegerData = (schema: ZapiSchemaInteger): ISchemaInteger => ({
    ...getSystemProperties(schema),
    ...getSchemaObjectPropertyElements(schema),
    ...getSchemaElements(schema),
    acceptedValues: schema.acceptedValues.value,
    apiReference: processTaxonomyElement(schema.apiReference),
    defaultValue: schema.defaultValue.value,
    format: processMultipleChoiceElement(schema.format),
    maximum: schema.maximum.value,
    minimum: schema.minimum.value,

});

const getSchemaNumberData = (schema: ZapiSchemaNumber): ISchemaNumber => ({
    ...getSystemProperties(schema),
    ...getSchemaObjectPropertyElements(schema),
    ...getSchemaElements(schema),
    acceptedValues: schema.acceptedValues.value,
    apiReference: processTaxonomyElement(schema.apiReference),
    format: processMultipleChoiceElement(schema.format),
    maximum: schema.maximum.value,
    minimum: schema.minimum.value,
});

const getSchemaObjectData = (schema: ZapiSchemaObject): ISchemaObject => ({
    ...getSystemProperties(schema),
    ...getSchemaElements(schema),
    additionalProperties: processLinkedItemsElement(schema.additionalProperties),
    apiReference: processTaxonomyElement(schema.apiReference),
    properties: schema.properties.getHtml(),
    required: schema.required.value,
});

const getSchemaOneOfData = (schema: ZapiSchemaOneof): ISchemaOneOf => ({
    ...getSystemProperties(schema),
    ...getSchemaElements(schema),
    apiReference: processTaxonomyElement(schema.apiReference),
    discriminator: schema.discriminator.getHtml(),
    schemas: processLinkedItemsElement(schema.schemas),
});

const getSchemaStringData = (schema: ZapiSchemaString): ISchemaString => ({
    ...getSystemProperties(schema),
    ...getSchemaObjectPropertyElements(schema),
    ...getSchemaElements(schema),
    acceptedValues: schema.acceptedValues.value,
    apiReference: processTaxonomyElement(schema.apiReference),
    defaultValue: schema.defaultValue.value,
    format: schema.format.value,
    maxLength: schema.maxlength.number,
    minLength: schema.minlength.number,
});

const getPropertyReferencingData = (item: ZapiPropertyReferencingASchema): IPropertyReferencingASchema => ({
    ...getSystemProperties(item),
    name: item.name.value,
    schema: processLinkedItemsElement(item.schema),
});

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

const processDiscriminators = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItemsInto<IDiscriminator>
(getItemsDataFromRichText<ZapiDiscriminator, IDiscriminator>(getDiscriminatorData))
(field, dataBlob, linkedItems);

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
): void => processItemsInto<IDiscriminatorMapItem>
(getItemsDataFromRichText<ZapiDiscriminatorMapItem, IDiscriminatorMapItem>(getDiscriminatorMapItemData))
(field, dataBlob, linkedItems);

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
