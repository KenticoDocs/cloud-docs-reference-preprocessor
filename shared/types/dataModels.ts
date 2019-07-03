import { Operation } from '../external/models';
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

export interface IPreprocessedData {
    readonly zapiSpecificationCodename: string,
    readonly items: any,
    readonly operation: Operation,
}

export interface ISystemAttributes {
    readonly id: string,
    readonly contentType: string,
}

export interface IWrappedItem<T> {
    readonly codename: string,
    readonly data: T,
}

export interface IZapiSpecification extends ISystemAttributes {
    readonly apiReference: string[],
    readonly categories: string[],
    readonly contact: string[],
    readonly description: string,
    readonly license: string[],
    readonly pathOperations: string[],
    readonly security: string[],
    readonly servers: string,
    readonly termsOfService: string,
    readonly title: string,
    readonly url: string,
    readonly version: string,
}

export interface ISecurityScheme extends ISystemAttributes {
    readonly apiKeyLocation: string,
    readonly apiKeyName: string,
    readonly apiReference: string[],
    readonly bearerFormat: string,
    readonly description: string,
    readonly name: string,
    readonly scheme: string,
    readonly type: string[],
}

export interface ILicense extends ISystemAttributes {
    readonly apiReference: string[],
    readonly name: string,
    readonly url: string,
}

export interface IContact extends ISystemAttributes {
    readonly apiReference: string[],
    readonly email: string,
    readonly name: string,
    readonly url: string,
}

export interface ICategory extends ISystemAttributes {
    readonly apiReference: string[],
    readonly description: string,
    readonly name: string,
    readonly url: string,
}

export interface IPathOperation extends ISystemAttributes {
    readonly apiReference: string[],
    readonly category: string[],
    readonly codeSamples: string[],
    readonly deprecated: string[],
    readonly description: string,
    readonly parameters: string[],
    readonly path: string,
    readonly pathOperation: string[],
    readonly requestBody: string,
    readonly responses: string,
    readonly name: string,
    readonly url: string,
}

export interface IParameter extends ISystemAttributes {
    readonly apiReference: string[],
    readonly deprecated: string[],
    readonly description: string,
    readonly example: string,
    readonly explode: string[],
    readonly location: string[],
    readonly name: string,
    readonly required: string[],
    readonly schema: string[],
    readonly style: string[],
}

export interface IRequestBody extends ISystemAttributes {
    readonly description: string,
    readonly example: string,
    readonly mediaType: string[],
    readonly required: string[],
    readonly schema: string,
}

export interface IResponse extends ISystemAttributes {
    readonly apiReference: string[],
    readonly description: string,
    readonly example: string,
    readonly headers: string[],
    readonly httpStatus: string[],
    readonly mediaType: string[],
    readonly schema: string,
}

export interface IServer extends ISystemAttributes {
    readonly description: string,
    readonly url: string,
}

export interface IImage extends ISystemAttributes {
    readonly border: string[],
    readonly zoomable: string[],
    readonly description: string,
    readonly imageWidth: string[],
    readonly url: string,
    readonly image: string,
}

export interface ICallout extends ISystemAttributes {
    readonly content: string,
    readonly type: string[],
}

export interface ICodeSample extends ISystemAttributes {
    readonly code: string,
    readonly platform: string[],
    readonly programmingLanguage: string[],
}

export interface ICodeSamples extends ISystemAttributes {
    readonly codeSamples: string[],
}

export type ZapiSchemas =
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

export type ISchemas =
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

export interface ISchemaElements {
    readonly name: string,
    readonly description: string,
    readonly example: string,
}

export interface ISchemaObjectPropertyElements {
    readonly nullable: string[],
    readonly readonly: string[],
    readonly writeonly: string[],
}

export interface ISchemaAllOf extends ISystemAttributes, ISchemaElements {
    readonly apiReference: string[],
    readonly schemas: string,
}

export interface ISchemaAnyOf extends ISystemAttributes, ISchemaElements, ISchemaObjectPropertyElements {
    readonly apiReference: string[],
    readonly schemas: string[],
}

export interface ISchemaArray extends ISystemAttributes, ISchemaElements {
    readonly apiReference: string[],
    readonly items: string,
    readonly uniqueItems: string[],
}

export interface ISchemaBoolean extends ISystemAttributes, ISchemaElements, ISchemaObjectPropertyElements {
    readonly apiReference: string[],
}

export interface ISchemaInteger extends ISystemAttributes, ISchemaElements, ISchemaObjectPropertyElements {
    readonly acceptedValues: string,
    readonly apiReference: string[],
    readonly defaultValue: number,
    readonly format: string[],
    readonly minimum: number,
    readonly maximum: number,
}

export interface ISchemaObject extends ISystemAttributes, ISchemaElements {
    readonly apiReference: string[],
    readonly required: string,
    readonly properties: string,
    readonly additionalProperties: string[],
}

export interface ISchemaOneOf extends ISystemAttributes, ISchemaElements {
    readonly apiReference: string[],
    readonly schemas: string[],
    readonly discriminator: string,
}

export interface ISchemaString extends ISystemAttributes, ISchemaElements, ISchemaObjectPropertyElements {
    readonly acceptedValues: string,
    readonly apiReference: string[],
    readonly defaultValue: string,
    readonly format: string,
    readonly maxLength: number,
    readonly minLength: number,
}

export interface ISchemaNumber extends ISystemAttributes, ISchemaElements, ISchemaObjectPropertyElements {
    readonly acceptedValues: string,
    readonly apiReference: string[],
    readonly format: string[],
    readonly maximum: number,
    readonly minimum: number,
}

export interface IDiscriminator extends ISystemAttributes {
    readonly propertyName: string,
    readonly mapping: string,
}

export interface IDiscriminatorMapItem extends ISystemAttributes {
    readonly discriminatorValue: string,
    readonly schema: string[],
}

export interface IPropertyReferencingASchema extends ISystemAttributes {
    readonly name: string,
    readonly schema: string[],
}
