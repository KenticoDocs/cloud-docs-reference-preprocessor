import { ContentItem, Fields } from 'kentico-cloud-delivery';
import { ZapiDiscriminator } from '../models/zapi_discriminator';
import { ZapiDiscriminatorMapItem } from '../models/zapi_discriminator__map_item';
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
    IDataObject,
    IDiscriminator,
    IDiscriminatorMapItem,
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
    IWrappedData,
    ZapiSchemas,
} from '../types/dataModels';
import {
    getFromLinkedItems,
    insertDataArrayIntoBlob,
    processLinkedItemsElement,
    processMultipleChoiceElement,
    processTaxonomyElement,
} from '../utils/helpers';
import { getSystemProperties, getWrappedData } from './dataGetters';
import { processItemsOfType } from './getProcessedData';
import { ZapiPropertyReferencingASchema } from '../models/zapi_property_referencing_a_schema';
import RichTextField = Fields.RichTextField;

export const getSchemaDataFromLinkedItemElement = (items: ZapiSchemas[], dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<ISchemas>> => {
    const schemas = [];

    items.map((schema: ZapiSchemas) => {
        schemas.push(getSchemaData(schema, dataBlob, linkedItems));
    });

    return schemas;
};

export const getSchemaDataFromRichTextElement = (field: RichTextField, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<ISchemaArray>> => {
    const schemas = [];

    field.linkedItemCodenames.map((codename: string) => {
        const schema = getFromLinkedItems<ZapiSchemaArray>(codename, linkedItems);

        schemas.push(getSchemaData(schema, dataBlob, linkedItems));
    });

    return schemas;
};

const getSchemaData = (schema: ZapiSchemas, dataBlob: IDataObject, linkedItems: ContentItem[]): IWrappedData<ISchemas> | undefined => {
    switch (schema.system.type) {
        case 'zapi_schema__array': {
            processItemsOfType<ISchemas>(
                getSchemaDataFromRichTextElement,
                insertDataArrayIntoBlob)
            (schema.items, dataBlob, linkedItems);

            return getSchemaArrayData(schema as ZapiSchemaArray);
        }
        case 'zapi_schema__anyof': {
            processItemsOfType<ISchemas>(
                getSchemaDataFromLinkedItemElement,
                insertDataArrayIntoBlob)
            (schema.schemas, dataBlob, linkedItems);

            return getSchemaAnyOfData(schema as ZapiSchemaAnyof);
        }
        case 'zapi_schema__allof': {
            processItemsOfType<ISchemas>(
                getSchemaDataFromRichTextElement,
                insertDataArrayIntoBlob)
            (schema.schemas, dataBlob, linkedItems);

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
            processItemsOfType<IPropertyReferencingASchema>(
                getPropertyReferencingASchemaData,
                insertDataArrayIntoBlob)
            (schema.properties, dataBlob, linkedItems);
            processItemsOfType<ISchemas>(
                getSchemaDataFromRichTextElement,
                insertDataArrayIntoBlob)
            (schema.properties, dataBlob, linkedItems);
            processItemsOfType<ISchemas>(
                getSchemaDataFromLinkedItemElement,
                insertDataArrayIntoBlob)
            (schema.additionalProperties, dataBlob, linkedItems);

            return getSchemaObjectData(schema as ZapiSchemaObject);
        }
        case 'zapi_schema__oneof': {
            processItemsOfType<IDiscriminator>(
                getDiscriminatorsData,
                insertDataArrayIntoBlob)
            (schema.discriminator, dataBlob, linkedItems);

            processItemsOfType<ISchemas>(
                getSchemaDataFromLinkedItemElement,
                insertDataArrayIntoBlob)
            (schema.schemaas, dataBlob, linkedItems);

            return getSchemaOneOfData(schema as ZapiSchemaOneof);
        }
        case 'zapi_schema__string': {
            return getSchemaStringData(schema as ZapiSchemaString);
        }
        default: {
            return undefined;
        }
    }
};

const getSchemaArrayData = (schema: ZapiSchemaArray) => {
    const dataObject: ISchemaArray = {
        ...getSystemProperties(schema),
        ...getSchemaElements(schema),
        apiReference: processTaxonomyElement(schema.apiReference),
        items: schema.items.getHtml(),
        uniqueItems: processMultipleChoiceElement(schema.uniqueitems),
    };

    return getWrappedData<ISchemaArray>(dataObject, schema);
};

const getSchemaAnyOfData = (schema: ZapiSchemaAnyof) => {
    const dataObject: ISchemaAnyOf = {
        ...getSystemProperties(schema),
        ...getSchemaObjectPropertyElements(schema),
        ...getSchemaElements(schema),
        apiReference: processTaxonomyElement(schema.apiReference),
        schemas: processLinkedItemsElement(schema.schemas),
    };

    return getWrappedData<ISchemaAnyOf>(dataObject, schema);
};

const getSchemaAllOfData = (schema: ZapiSchemaAllof) => {
    const dataObject: ISchemaAllOf = {
        ...getSystemProperties(schema),
        ...getSchemaElements(schema),
        apiReference: processTaxonomyElement(schema.apiReference),
        schemas: schema.items.getHtml(),
    };

    return getWrappedData<ISchemaAllOf>(dataObject, schema);
};

const getSchemaBooleanData = (schema: ZapiSchemaBoolean) => {
    const dataObject: ISchemaBoolean = {
        ...getSystemProperties(schema),
        ...getSchemaObjectPropertyElements(schema),
        ...getSchemaElements(schema),
        apiReference: processTaxonomyElement(schema.apiReference),
    };

    return getWrappedData<ISchemaBoolean>(dataObject, schema);
};

const getSchemaIntegerData = (schema: ZapiSchemaInteger) => {
    const dataObject: ISchemaInteger = {
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

    return getWrappedData<ISchemaInteger>(dataObject, schema);
};

const getSchemaNumberData = (schema: ZapiSchemaNumber) => {
    const dataObject: ISchemaNumber = {
        ...getSystemProperties(schema),
        ...getSchemaObjectPropertyElements(schema),
        ...getSchemaElements(schema),
        acceptedValues: schema.acceptedValues.value,
        apiReference: processTaxonomyElement(schema.apiReference),
        format: processMultipleChoiceElement(schema.format),
        maximum: schema.maximum.value,
        minimum: schema.minimum.value,
    };

    return getWrappedData<ISchemaNumber>(dataObject, schema);
};

const getSchemaObjectData = (schema: ZapiSchemaObject) => {
    const dataObject: ISchemaObject = {
        ...getSystemProperties(schema),
        ...getSchemaElements(schema),
        additionalProperties: processLinkedItemsElement(schema.additionalProperties),
        apiReference: processTaxonomyElement(schema.apiReference),
        properties: schema.properties.getHtml(),
        required: schema.required.value,
    };

    return getWrappedData<ISchemaObject>(dataObject, schema);
};

const getSchemaOneOfData = (schema: ZapiSchemaOneof) => {
    const dataObject: ISchemaOneOf = {
        ...getSystemProperties(schema),
        ...getSchemaElements(schema),
        apiReference: processTaxonomyElement(schema.apiReference),
        discriminator: schema.discriminator.getHtml(),
        schemas: processLinkedItemsElement(schema.schemas),
    };

    return getWrappedData<ISchemaOneOf>(dataObject, schema);
};

const getSchemaStringData = (schema: ZapiSchemaString) => {
    const dataObject: ISchemaString = {
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

    return getWrappedData<ISchemaString>(dataObject, schema);
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

export const getDiscriminatorsData = (field: RichTextField, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<IDiscriminator>> => {
    const discriminators = [];

    field.linkedItemCodenames.map((codename: string) => {
        const linkedItem = getFromLinkedItems<ZapiDiscriminator>(codename, linkedItems);

        if (linkedItem && linkedItem.mapping && linkedItem.propertyName) {
            processItemsOfType<IDiscriminatorMapItem>(
                getDiscriminatorMapItemsData,
                insertDataArrayIntoBlob)
            (linkedItem.mapping, dataBlob, linkedItems);

            const dataObject: IDiscriminator = {
                ...getSystemProperties(linkedItem),
                mapping: linkedItem.mapping.getHtml(),
                propertyName: linkedItem.propertyName.value,
            };

            discriminators.push(getWrappedData<IDiscriminator>(dataObject, linkedItem));
        }
    });

    return discriminators;
};

export const getDiscriminatorMapItemsData = (field: RichTextField, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<IDiscriminatorMapItem>> => {
    const discriminators = [];

    field.linkedItemCodenames.map((codename: string) => {
        const linkedItem = getFromLinkedItems<ZapiDiscriminatorMapItem>(codename, linkedItems);

        if (linkedItem && linkedItem.schema && linkedItem.discriminatorValue) {
            processItemsOfType<ISchemas>(
                getSchemaDataFromLinkedItemElement,
                insertDataArrayIntoBlob)
            (linkedItem.schema, dataBlob, linkedItems);

            const dataObject: IDiscriminatorMapItem = {
                ...getSystemProperties(linkedItem),
                discriminatorValue: linkedItem.discriminatorValue.value,
                schema: processLinkedItemsElement(linkedItem.schema),
            };

            discriminators.push(getWrappedData<IDiscriminatorMapItem>(dataObject, linkedItem));
        }
    });

    return discriminators;
};

export const getPropertyReferencingASchemaData = (field: RichTextField, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<IPropertyReferencingASchema>> => {
    const discriminators = [];

    field.linkedItemCodenames.map((codename: string) => {
        const linkedItem = getFromLinkedItems<ZapiPropertyReferencingASchema>(codename, linkedItems);

        if (linkedItem && linkedItem.name && linkedItem.schema) {
            processItemsOfType<ISchemas>(
                getSchemaDataFromLinkedItemElement,
                insertDataArrayIntoBlob)
            (linkedItem.schema, dataBlob, linkedItems);

            const dataObject: IPropertyReferencingASchema = {
                ...getSystemProperties(linkedItem),
                name: linkedItem.name.value,
                schema: processLinkedItemsElement(linkedItem.schema),
            };

            discriminators.push(getWrappedData<IPropertyReferencingASchema>(dataObject, linkedItem));
        }
    });

    return discriminators;
};
