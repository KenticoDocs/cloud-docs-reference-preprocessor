import { DeliveryClient, TypeResolver } from 'kentico-cloud-delivery';
import { Callout } from '../models/callout';
import { CodeSample } from '../models/code_sample';
import { CodeSamples } from '../models/code_samples';
import { Image } from '../models/image';
import { ZapiCategory } from '../models/zapi_category';
import { ZapiContact } from '../models/zapi_contact';
import { ZapiDiscriminator } from '../models/zapi_discriminator';
import { ZapiDiscriminatorMapItem } from '../models/zapi_discriminator__map_item';
import { ZapiLicense } from '../models/zapi_license';
import { ZapiParameter } from '../models/zapi_parameter';
import { ZapiPath } from '../models/zapi_path';
import { ZapiPathOperation } from '../models/zapi_path_operation';
import { ZapiPropertyReferencingASchema } from '../models/zapi_property_referencing_a_schema';
import { ZapiRequestBody } from '../models/zapi_request_body';
import { ZapiResponse } from '../models/zapi_response';
import { ZapiResponseContainer } from '../models/zapi_response_container';
import { ZapiResponseContent } from '../models/zapi_response_content';
import { ZapiSchemaAllof } from '../models/zapi_schema__allof';
import { ZapiSchemaArray } from '../models/zapi_schema__array';
import { ZapiSchemaBoolean } from '../models/zapi_schema__boolean';
import { ZapiSchemaInteger } from '../models/zapi_schema__integer';
import { ZapiSchemaObject } from '../models/zapi_schema__object';
import { ZapiSchemaOneof } from '../models/zapi_schema__oneof';
import { ZapiSchemaString } from '../models/zapi_schema__string';
import { ZapiSecurityScheme } from '../models/zapi_security_scheme';
import { ZapiServer } from '../models/zapi_server';
import { ZapiSpecification } from '../models/zapi_specification';

export const deliveryClient = new DeliveryClient({
    previewApiKey: process.env['KC.PreviewApiKey'],
    projectId: process.env['KC.ProjectId'],
    // securedApiKey: process.env['KC.SecuredApiKey'],
    typeResolvers: [
        new TypeResolver('callout', () => new CodeSample()),
        new TypeResolver('code_sample', () => new CodeSamples()),
        new TypeResolver('code_samples', () => new Callout()),
        new TypeResolver('image', () => new Image()),
        new TypeResolver('zapi_category', () => new ZapiCategory()),
        new TypeResolver('zapi_contact', () => new ZapiContact()),
        new TypeResolver('zapi_discriminator', () => new ZapiDiscriminator()),
        new TypeResolver('zapi_discriminator_map_item', () => new ZapiDiscriminatorMapItem()),
        new TypeResolver('zapi_license', () => new ZapiLicense()),
        new TypeResolver('zapi_parameter', () => new ZapiParameter()),
        new TypeResolver('zapi_path', () => new ZapiPath()),
        new TypeResolver('zapi_path_operation', () => new ZapiPathOperation()),
        new TypeResolver('zapi_property_referencing_a_schema', () => new ZapiPropertyReferencingASchema()),
        new TypeResolver('zapi_request_body', () => new ZapiRequestBody()),
        new TypeResolver('zapi_response', () => new ZapiResponse()),
        new TypeResolver('zapi_response_container', () => new ZapiResponseContainer()),
        new TypeResolver('zapi_response_content', () => new ZapiResponseContent()),
        new TypeResolver('zapi_schema_allof', () => new ZapiSchemaAllof()),
        new TypeResolver('zapi_schema_array', () => new ZapiSchemaArray()),
        new TypeResolver('zapi_schema_boolean', () => new ZapiSchemaBoolean()),
        new TypeResolver('zapi_schema_integer', () => new ZapiSchemaInteger()),
        new TypeResolver('zapi_schema_object', () => new ZapiSchemaObject()),
        new TypeResolver('zapi_schema_oneof', () => new ZapiSchemaOneof()),
        new TypeResolver('zapi_schema_string', () => new ZapiSchemaString()),
        new TypeResolver('zapi_security_scheme', () => new ZapiSecurityScheme()),
        new TypeResolver('zapi_server', () => new ZapiServer()),
        new TypeResolver('zapi_specification', () => new ZapiSpecification()),
    ],
});
