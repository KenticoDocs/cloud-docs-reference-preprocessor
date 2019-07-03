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
    ICategory,
    IContact,
    ILicense,
    IParameter,
    IPathOperation,
    IPreprocessedData,
    IRequestBody,
    IResponse,
    ISchemas,
    ISecurityScheme,
    IServer,
    IWrappedItem,
    IZapiSpecification,
} from '../types/dataModels';
import {
    getFromLinkedItems,
    processLinkedItemsElement,
    processMultipleChoiceElement,
    processTaxonomyElement,
} from '../utils/processElements';
import {
    getSystemProperties,
    getWrappedData,
    processItemsInto,
} from './common';
import {
    getDescriptionItemsData,
    IDescriptionComponents,
} from './descriptionItemGetters';
import {
    getSchemaDataFromLinkedItemElement,
    getSchemaDataFromRichTextElement,
} from './schemaGetters';
import RichTextField = Fields.RichTextField;

export const getApiSpecificationData = (
    item: ZapiSpecification,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): Array<IWrappedItem<IZapiSpecification>> => {
    processItemsInto<ICategory>(getCategoriesData)(item.categories, dataBlob, linkedItems);
    processItemsInto<IContact>(getContactData)(item.contact, dataBlob, linkedItems);
    processItemsInto<ILicense>(getLicenseData)(item.license, dataBlob, linkedItems);
    processItemsInto<IPathOperation>(getPathOperationsData)(item.pathOperations, dataBlob, linkedItems);
    processItemsInto<ISecurityScheme>(getSecuritySchemeData)(item.security, dataBlob);
    processItemsInto<IServer>(getServersData)(item.servers, dataBlob, linkedItems);
    processItemsInto<IDescriptionComponents>(getDescriptionItemsData)(item.description, dataBlob, linkedItems);

    const dataObject: IZapiSpecification = {
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

    return [
        getWrappedData<IZapiSpecification>(dataObject, item),
    ];
};

export const getSecuritySchemeData = (items: ZapiSecurityScheme[]): Array<IWrappedItem<ISecurityScheme>> => {
    if (items.length === 1) {
        const securityScheme = items[0];
        const dataObject: ISecurityScheme = {
            ...getSystemProperties(securityScheme),
            apiKeyLocation: securityScheme.apiKeyLocation.value,
            apiKeyName: securityScheme.apiKeyName.value,
            apiReference: processTaxonomyElement(securityScheme.apiReference),
            bearerFormat: securityScheme.bearerFormat.value,
            description: securityScheme.description.getHtml(),
            name: securityScheme.name.value,
            scheme: securityScheme.scheme.value,
            type: processMultipleChoiceElement(securityScheme.type),
        };

        return [
            getWrappedData<ISecurityScheme>(dataObject, securityScheme),
        ];
    } else {
        return [];
    }
};

export const getLicenseData = (items: ZapiLicense[]): Array<IWrappedItem<ILicense>> => {
    if (items.length === 1) {
        const licenseItem = items[0];
        const dataObject: ILicense = {
            ...getSystemProperties(licenseItem),
            apiReference: processTaxonomyElement(licenseItem.apiReference),
            name: licenseItem.name.value,
            url: licenseItem.url.value,
        };

        return [
            getWrappedData<ILicense>(dataObject, licenseItem),
        ];
    } else {
        return [];
    }
};

export const getContactData = (items: ZapiContact[]): Array<IWrappedItem<IContact>> => {
    if (items.length === 1) {
        const contactItem = items[0];
        const dataObject: IContact = {
            ...getSystemProperties(contactItem),
            apiReference: processTaxonomyElement(contactItem.apiReference),
            email: contactItem.email.value,
            name: contactItem.name.value,
            url: contactItem.url.value,
        };

        return [
            getWrappedData<IContact>(dataObject, contactItem),
        ];
    } else {
        return [];
    }
};

export const getCategoriesData = (
    items: ZapiCategory[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): Array<IWrappedItem<ICategory>> => {
    const categories = [];
    items.map((category: ZapiCategory) => {
        processItemsInto<IDescriptionComponents>(getDescriptionItemsData)(category.description, dataBlob, linkedItems);

        const dataObject: ICategory = {
            ...getSystemProperties(category),
            apiReference: processTaxonomyElement(category.apiReference),
            description: category.description.getHtml(),
            name: category.name.value,
            url: category.url.value,
        };

        categories.push(getWrappedData<ICategory>(dataObject, category));
    });

    return categories;
};

export const getPathOperationsData = (
    items: ZapiPathOperation[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): Array<IWrappedItem<IPathOperation>> => {
    const paths = [];

    items.map((pathOperation: ZapiPathOperation) => {
        // Category items already processed within the zAPI Specification object
        processItemsInto<IParameter>(getParametersData)(pathOperation.parameters, dataBlob, linkedItems);
        processItemsInto<IRequestBody>(getRequestBodiesData)(pathOperation.requestBody, dataBlob, linkedItems);
        processItemsInto<IResponse>(getResponsesData)(pathOperation.responses, dataBlob, linkedItems);
        processItemsInto<IDescriptionComponents>(getDescriptionItemsData)(
            pathOperation.description,
            dataBlob,
            linkedItems,
        );

        const dataObject: IPathOperation = {
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

        paths.push(getWrappedData(dataObject, pathOperation));
    });

    return paths;
};

export const getServersData = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): Array<IWrappedItem<IServer>> => {
    const servers = [];

    field.linkedItemCodenames.map((codename: string) => {
        const server = getFromLinkedItems<ZapiServer>(codename, linkedItems);
        const dataObject: IServer = {
            ...getSystemProperties(server),
            description: server.description.value,
            url: server.url.value,
        };

        servers.push(getWrappedData<IServer>(dataObject, server));
    });

    return servers;
};

export const getParametersData = (
    items: ZapiParameter[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): Array<IWrappedItem<IParameter>> => {
    const parameters = [];

    items.map((parameter: ZapiParameter) => {
        processItemsInto<ISchemas>(getSchemaDataFromLinkedItemElement)(parameter.schema, dataBlob, linkedItems);
        processItemsInto<IDescriptionComponents>(getDescriptionItemsData)(parameter.description, dataBlob, linkedItems);

        const dataObject: IParameter = {
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

        parameters.push(getWrappedData<IParameter>(dataObject, parameter));
    });

    return parameters;
};

export const getRequestBodiesData = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): Array<IWrappedItem<IRequestBody>> => {
    const requestBodies = [];

    field.linkedItemCodenames.map((codename: string) => {
        const requestBody = getFromLinkedItems<ZapiRequestBody>(codename, linkedItems);
        processItemsInto<ISchemas>(getSchemaDataFromRichTextElement)(requestBody.schema, dataBlob, linkedItems);
        processItemsInto<IDescriptionComponents>(getDescriptionItemsData)(
            requestBody.description,
            dataBlob,
            linkedItems,
        );

        const dataObject: IRequestBody = {
            ...getSystemProperties(requestBody),
            description: requestBody.description.getHtml(),
            example: requestBody.example.value,
            mediaType: processMultipleChoiceElement(requestBody.mediaType),
            required: processMultipleChoiceElement(requestBody.required),
            schema: requestBody.schema.getHtml(),
        };

        requestBodies.push(getWrappedData<IRequestBody>(dataObject, requestBody));
    });

    return requestBodies;
};

export const getResponsesData = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): Array<IWrappedItem<IResponse>> => {
    const responses = [];

    field.linkedItemCodenames.map((codename: string) => {
        const response = getFromLinkedItems<ZapiResponse>(codename, linkedItems);
        processItemsInto<IParameter>(getParametersData)(response.headers, dataBlob, linkedItems);
        processItemsInto<ISchemas>(getSchemaDataFromRichTextElement)(response.schema, dataBlob, linkedItems);
        processItemsInto<IDescriptionComponents>(getDescriptionItemsData)(response.description, dataBlob, linkedItems);

        const dataObject: IResponse = {
            ...getSystemProperties(response),
            apiReference: processTaxonomyElement(response.apiReference),
            description: response.description.getHtml(),
            example: response.example.value,
            headers: processLinkedItemsElement(response.headers),
            httpStatus: processMultipleChoiceElement(response.httpStatus),
            mediaType: processMultipleChoiceElement(response.mediaType),
            schema: response.schema.getHtml(),
        };

        responses.push(getWrappedData<IResponse>(dataObject, response));
    });

    return responses;
};
