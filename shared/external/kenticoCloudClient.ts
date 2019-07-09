import {
    ContentItem,
    DeliveryClient,
    IDeliveryClient,
    TypeResolver,
} from 'kentico-cloud-delivery';
import { Callout } from '../models/callout';
import { CodeSample } from '../models/code_sample';
import { CodeSamples } from '../models/code_samples';
import { ContentChunk } from '../models/content_chunk';
import { Image } from '../models/image';
import { ZapiCategory } from '../models/zapi__category';
import { ZapiContact } from '../models/zapi_contact';
import { ZapiDiscriminator } from '../models/zapi_discriminator';
import { ZapiDiscriminatorMapItem } from '../models/zapi_discriminator__map_item';
import { ZapiLicense } from '../models/zapi_license';
import { ZapiParameter } from '../models/zapi_parameter';
import { ZapiPathOperation } from '../models/zapi_path_operation';
import { ZapiPropertyReferencingASchema } from '../models/zapi_property_referencing_a_schema';
import { ZapiRequestBody } from '../models/zapi_request_body';
import { ZapiResponse } from '../models/zapi_response';
import { ZapiSchemaAllof } from '../models/zapi_schema__allof';
import { ZapiSchemaAnyof } from '../models/zapi_schema__anyof';
import { ZapiSchemaArray } from '../models/zapi_schema__array';
import { ZapiSchemaBoolean } from '../models/zapi_schema__boolean';
import { ZapiSchemaInteger } from '../models/zapi_schema__integer';
import { ZapiSchemaNumber } from '../models/zapi_schema__number';
import { ZapiSchemaObject } from '../models/zapi_schema__object';
import { ZapiSchemaOneof } from '../models/zapi_schema__oneof';
import { ZapiSchemaString } from '../models/zapi_schema__string';
import { ZapiSecurityScheme } from '../models/zapi_security_scheme';
import { ZapiServer } from '../models/zapi_server';
import { ZapiSpecification } from '../models/zapi_specification';
import { Configuration } from './configuration';
import { resolveItemInRichText } from './richTextResolver';

export const RootItemType = 'zapi_specification';
export const DepthParameter = 20;

interface IResponseItems {
    readonly items: ZapiSpecification[];
    readonly linkedItems: ContentItem[];
}

export const getApiItems = async (deliveryClientGetter: () => IDeliveryClient): Promise<IResponseItems> => {
    const response = await deliveryClientGetter()
        .items<ZapiSpecification>()
        .type(RootItemType)
        .queryConfig({
            richTextResolver: resolveItemInRichText,
        })
        .depthParameter(DepthParameter)
        .getPromise();

    return {
        items: response.items,
        linkedItems: response.linkedItems,
    };
};

export const getDeliveryClient = (): IDeliveryClient => new DeliveryClient({
    enableSecuredMode: true,
    globalHeaders,
    projectId: Configuration.keys.kenticoProjectId,
    securedApiKey: Configuration.keys.securedApiKey,
    typeResolvers,
});

export const getPreviewDeliveryClient = (): IDeliveryClient => new DeliveryClient({
    enablePreviewMode: true,
    globalHeaders,
    previewApiKey: Configuration.keys.previewApiKey,
    projectId: Configuration.keys.kenticoProjectId,
    typeResolvers,
});

const globalHeaders = [
    {
        header: 'X-KC-Wait-For-Loading-New-Content',
        value: 'true',
    },
];

const typeResolvers = [
    new TypeResolver('callout', () => new Callout()),
    new TypeResolver('code_sample', () => new CodeSample()),
    new TypeResolver('code_samples', () => new CodeSamples()),
    new TypeResolver('content_chunk', () => new ContentChunk()),
    new TypeResolver('image', () => new Image()),
    new TypeResolver('zapi__category', () => new ZapiCategory()),
    new TypeResolver('zapi_contact', () => new ZapiContact()),
    new TypeResolver('zapi_discriminator', () => new ZapiDiscriminator()),
    new TypeResolver('zapi_discriminator__map_item', () => new ZapiDiscriminatorMapItem()),
    new TypeResolver('zapi_license', () => new ZapiLicense()),
    new TypeResolver('zapi_parameter', () => new ZapiParameter()),
    new TypeResolver('zapi_path_operation', () => new ZapiPathOperation()),
    new TypeResolver('zapi_property_referencing_a_schema', () => new ZapiPropertyReferencingASchema()),
    new TypeResolver('zapi_request_body', () => new ZapiRequestBody()),
    new TypeResolver('zapi_response', () => new ZapiResponse()),
    new TypeResolver('zapi_schema__allof', () => new ZapiSchemaAllof()),
    new TypeResolver('zapi_schema__anyof', () => new ZapiSchemaAnyof()),
    new TypeResolver('zapi_schema__array', () => new ZapiSchemaArray()),
    new TypeResolver('zapi_schema__boolean', () => new ZapiSchemaBoolean()),
    new TypeResolver('zapi_schema__integer', () => new ZapiSchemaInteger()),
    new TypeResolver('zapi_schema__number', () => new ZapiSchemaNumber()),
    new TypeResolver('zapi_schema__object', () => new ZapiSchemaObject()),
    new TypeResolver('zapi_schema__oneof', () => new ZapiSchemaOneof()),
    new TypeResolver('zapi_schema__string', () => new ZapiSchemaString()),
    new TypeResolver('zapi_security_scheme', () => new ZapiSecurityScheme()),
    new TypeResolver('zapi_server', () => new ZapiServer()),
    new TypeResolver('zapi_specification', () => new ZapiSpecification()),
];
