import {
    ContentItem,
    Fields,
} from 'kentico-cloud-delivery';
import { ZapiCategory } from '../models/zapi__category';
import { ZapiContact } from '../models/zapi_contact';
import { ZapiLicense } from '../models/zapi_license';
import { ZapiParameter } from '../models/zapi_parameter';
import { ZapiPathOperation } from '../models/zapi_path_operation';
import { ZapiRequestBody } from '../models/zapi_request_body';
import { ZapiResponse } from '../models/zapi_response';
import { ZapiSecurityScheme } from '../models/zapi_security_scheme';
import { ZapiServer } from '../models/zapi_server';
import { ZapiSpecification } from '../models/zapi_specification';
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
import { processDescriptionComponents } from './descriptionComponents';
import {
    ICategory,
    IContact,
    ILicense,
    IParameter,
    IPathOperation,
    IPreprocessedData,
    IRequestBody,
    IResponse,
    ISecurityScheme,
    IServer,
    IZapiSpecification,
} from './processedDataModels';
import {
    processSchemasFromLinkedItemsElement,
    processSchemasFromRichTextElement,
} from './schemas';
import RichTextField = Fields.RichTextField;

export const processApiSpecification = (
    items: ZapiSpecification[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromLinkedItems<ZapiSpecification, IZapiSpecification>(getApiSpecificationData),
)(items, dataBlob, linkedItems);

const getApiSpecificationData = (
    item: ZapiSpecification,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): IZapiSpecification => {
    processCategories(item.categories, dataBlob, linkedItems);
    processContacts(item.contact, dataBlob, linkedItems);
    processLicenses(item.license, dataBlob, linkedItems);
    processPathOperations(item.pathOperations, dataBlob, linkedItems);
    processSecuritySchemes(item.security, dataBlob, linkedItems);
    processServers(item.servers, dataBlob, linkedItems);
    processDescriptionComponents(item.description, dataBlob, linkedItems);

    return {
        ...getSystemProperties(item),
        apiReference: processTaxonomyElement(item.apiReference),
        categories: processLinkedItemsElement(item.categories),
        contact: processLinkedItemsElement(item.contact),
        description: item.description.getHtml(),
        license: processLinkedItemsElement(item.license),
        pathOperations: processLinkedItemsElement(item.pathOperations),
        security: processLinkedItemsElement(item.security),
        servers: item.servers.getHtml(),
        termsOfService: item.termsOfService.value,
        title: item.title.value,
        url: item.url.value,
        version: item.version.value,
    };
};

const processSecuritySchemes = (
    items: ContentItem[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromLinkedItems<ZapiSecurityScheme, ISecurityScheme>(getSecuritySchemeData),
)(items, dataBlob, linkedItems);

const getSecuritySchemeData = (securityScheme: ZapiSecurityScheme): ISecurityScheme => ({
    ...getSystemProperties(securityScheme),
    apiKeyLocation: securityScheme.apiKeyLocation.value,
    apiKeyName: securityScheme.apiKeyName.value,
    apiReference: processTaxonomyElement(securityScheme.apiReference),
    bearerFormat: securityScheme.bearerFormat.value,
    description: securityScheme.description.getHtml(),
    name: securityScheme.name.value,
    scheme: securityScheme.scheme.value,
    type: processMultipleChoiceElement(securityScheme.type),
});

const processLicenses = (
    items: ContentItem[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromLinkedItems<ZapiLicense, ILicense>(getLicenseData),
)(items, dataBlob, linkedItems);

const getLicenseData = (license: ZapiLicense): ILicense => ({
    ...getSystemProperties(license),
    apiReference: processTaxonomyElement(license.apiReference),
    name: license.name.value,
    url: license.url.value,
});

const processContacts = (
    items: ContentItem[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromLinkedItems<ZapiContact, IContact>(getContactData),
)(items, dataBlob, linkedItems);

const getContactData = (contact: ZapiContact): IContact => ({
    ...getSystemProperties(contact),
    apiReference: processTaxonomyElement(contact.apiReference),
    email: contact.email.value,
    name: contact.name.value,
    url: contact.url.value,
});

const processCategories = (
    items: ContentItem[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromLinkedItems<ZapiCategory, ICategory>(getCategoryData),
)(items, dataBlob, linkedItems);

const getCategoryData = (
    category: ZapiCategory,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ICategory => {
    processDescriptionComponents(category.description, dataBlob, linkedItems);

    return {
        ...getSystemProperties(category),
        apiReference: processTaxonomyElement(category.apiReference),
        description: category.description.getHtml(),
        name: category.name.value,
        url: category.url.value,
    };
};

const processPathOperations = (
    items: ContentItem[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromLinkedItems<ZapiPathOperation, IPathOperation>(getPathOperationData),
)(items, dataBlob, linkedItems);

const getPathOperationData = (
    pathOperation: ZapiPathOperation,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): IPathOperation => {
    // Category items already processed within the zAPI Specification object
    processParameters(pathOperation.parameters, dataBlob, linkedItems);
    processRequestBodies(pathOperation.requestBody, dataBlob, linkedItems);
    processResponses(pathOperation.responses, dataBlob, linkedItems);
    processDescriptionComponents(pathOperation.description, dataBlob, linkedItems);

    return {
        ...getSystemProperties(pathOperation),
        apiReference: processTaxonomyElement(pathOperation.apiReference),
        category: processLinkedItemsElement(pathOperation.category),
        codeSamples: processLinkedItemsElement(pathOperation.codeSamples),
        deprecated: processMultipleChoiceElement(pathOperation.deprecated),
        description: pathOperation.description.getHtml(),
        name: pathOperation.name.value,
        parameters: processLinkedItemsElement(pathOperation.parameters),
        path: pathOperation.path.value,
        pathOperation: processTaxonomyElement(pathOperation.pathOperation),
        requestBody: pathOperation.requestBody.getHtml(),
        responses: pathOperation.responses.getHtml(),
        url: pathOperation.url.value,
    };
};

const processServers = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromRichText<ZapiServer, IServer>(getServersData),
)(field, dataBlob, linkedItems);

const getServersData = (server: ZapiServer): IServer => ({
    ...getSystemProperties(server),
    description: server.description.value,
    url: server.url.value,
});

const processParameters = (
    items: ContentItem[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromLinkedItems<ZapiParameter, IParameter>(getParametersData),
)(items, dataBlob, linkedItems);

const getParametersData = (
    parameter: ZapiParameter,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): IParameter => {
    processSchemasFromLinkedItemsElement(parameter.schema, dataBlob, linkedItems);
    processDescriptionComponents(parameter.description, dataBlob, linkedItems);

    return {
        ...getSystemProperties(parameter),
        apiReference: processTaxonomyElement(parameter.apiReference),
        deprecated: processMultipleChoiceElement(parameter.deprecated),
        description: parameter.description.getHtml(),
        example: parameter.example.value,
        explode: processMultipleChoiceElement(parameter.explode),
        location: processMultipleChoiceElement(parameter.location),
        name: parameter.name.value,
        required: processMultipleChoiceElement(parameter.required),
        schema: processLinkedItemsElement(parameter.schema),
        style: processMultipleChoiceElement(parameter.style),
    };
};

const processRequestBodies = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromRichText<ZapiRequestBody, IRequestBody>(getRequestBodiesData),
)(field, dataBlob, linkedItems);

const getRequestBodiesData = (
    requestBody: ZapiRequestBody,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): IRequestBody => {
    processSchemasFromRichTextElement(requestBody.schema, dataBlob, linkedItems);
    processDescriptionComponents(requestBody.description, dataBlob, linkedItems);

    return {
        ...getSystemProperties(requestBody),
        description: requestBody.description.getHtml(),
        example: requestBody.example.value,
        mediaType: processMultipleChoiceElement(requestBody.mediaType),
        required: processMultipleChoiceElement(requestBody.required),
        schema: requestBody.schema.getHtml(),
    };
};

const processResponses = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromRichText<ZapiResponse, IResponse>(getResponseData),
)(field, dataBlob, linkedItems);

const getResponseData = (
    response: ZapiResponse,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): IResponse => {
    processParameters(response.headers, dataBlob, linkedItems);
    processSchemasFromRichTextElement(response.schema, dataBlob, linkedItems);
    processDescriptionComponents(response.description, dataBlob, linkedItems);

    return {
        ...getSystemProperties(response),
        apiReference: processTaxonomyElement(response.apiReference),
        description: response.description.getHtml(),
        example: response.example.value,
        headers: processLinkedItemsElement(response.headers),
        httpStatus: processMultipleChoiceElement(response.httpStatus),
        mediaType: processMultipleChoiceElement(response.mediaType),
        schema: response.schema.getHtml(),
    };
};
