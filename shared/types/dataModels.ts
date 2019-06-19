export interface IBlobObject {
    readonly webhook: string | any,
    readonly data: IDataObject,
}

export interface IDataObject {
    api_specification: any,
    readonly items: any,
}

export interface IZapiSpecification {
    readonly apiReference: string[],
    readonly categories: string[],
    readonly codename: string,
    readonly contact: string[],
    readonly description: string,
    readonly featureReleaseStatus: string[],
    readonly id: string,
    readonly license: string[],
    readonly paths: string[],
    readonly security: string[],
    readonly servers: string,
    readonly termsOfService: string,
    readonly title: string,
    readonly url: string,
    readonly version: string,
}

export interface ISystemAttributes {
    readonly id: string,
    readonly contentType: string,
}

export interface IWrappedData<T> {
    readonly codename: string,
    readonly data: T,
}

export type IDataToInsert<T> = IWrappedData<T> | Array<IWrappedData<T>>

export interface ISecurityScheme extends ISystemAttributes {
    readonly apiReference: string[],
    readonly bearerFormat: string,
    readonly description: string,
    readonly in: string,
    readonly name: string,
    readonly scheme: string,
    readonly schemeName: string,
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
}

export interface IPath extends ISystemAttributes {
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
    readonly summary: string,
    readonly url: string,
}

export interface IParameter extends ISystemAttributes {
    readonly apiReference: string[],
    readonly deprecated: string[],
    readonly description: string,
    readonly example: string,
    readonly explode: string[],
    readonly in: string[],
    readonly name: string,
    readonly required: string[],
    readonly schema: string[],
    readonly style: string[],
}

export interface IRequestBody extends ISystemAttributes {
    readonly description: string,
    readonly example: string,
    readonly mediaType: string,
    readonly required: string[],
    readonly schema: string,
}

export interface IResponseContainer extends ISystemAttributes {
    readonly httpStatus: string[],
    readonly response: string,
}

export interface IResponse extends ISystemAttributes {
    readonly apiReference: string[],
    readonly content: string,
    readonly description: string,
    readonly headers: string[],
}

export interface IResponseContent extends ISystemAttributes {
    readonly example: string,
    readonly mediaType: string,
    readonly schema: string,
}

export interface IServer extends ISystemAttributes {
    readonly description: string,
    readonly url: string,
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

interface ICommonSchemaElements {
    readonly name: string,
    readonly description: string,
    readonly example: string,
}

interface ICommonSchemaPropertyElements {
    readonly nullable: string[],
    readonly readonly: string[],
    readonly writeonly: string[],
}

export interface ISchemaAllOf extends ISystemAttributes, ICommonSchemaElements {
    readonly schemas: string,
}

export interface ISchemaArray extends ISystemAttributes, ICommonSchemaElements {
    readonly items: string,
    readonly uniqueItems: string[],
}

export interface ISchemaBoolean extends ISystemAttributes, ICommonSchemaElements, ICommonSchemaPropertyElements {
}

export interface ISchemaInteger extends ISystemAttributes, ICommonSchemaElements, ICommonSchemaPropertyElements {
    readonly text: string,
    readonly minimum: string,
    readonly maximum: string,
    readonly acceptedValues: string,
    readonly default: string,
}

export interface ISchemaObject extends ISystemAttributes, ICommonSchemaElements {
    readonly apiReference: string[],
    readonly text: string,
    readonly properties: string,
    readonly additionalProperties: string[],
}

export interface ISchemaOneOf extends ISystemAttributes, ICommonSchemaElements {
    readonly apiReference: string[],
    readonly schemas: string[],
    readonly discriminator: string[],
}

export interface ISchemaString extends ISystemAttributes, ICommonSchemaElements, ICommonSchemaPropertyElements {
    readonly default: string,
    readonly format: string,
    readonly acceptedValues: string,
    readonly maxLength: string,
    readonly minLength: string,
}

export interface IDiscriminator extends ISystemAttributes {
    readonly propertyName: string,
    readonly mapping: string,
}

export interface IDiscriminatorMapItem extends ISystemAttributes {
    readonly discriminatorValue: string,
    readonly schema: string[],
}
