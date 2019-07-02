import { ContentItem, Fields } from 'kentico-cloud-delivery';
import { Callout } from '../models/callout';
import { CodeSample } from '../models/code_sample';
import { CodeSamples } from '../models/code_samples';
import { Image } from '../models/image';
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
    ICallout,
    ICategory,
    ICodeSample,
    ICodeSamples,
    IContact,
    IImage,
    ILicense,
    IParameter,
    IPathOperation,
    IPreprocessedData,
    IRequestBody,
    IResponse,
    ISchemas,
    ISecurityScheme,
    IServer,
    ISystemAttributes,
    IWrappedData,
    IZapiSpecification,
} from '../types/dataModels';
import {
    getFromLinkedItems,
    insertDataArrayIntoBlob,
    insertDataIntoBlob,
    processLinkedItemsElement,
    processMultipleChoiceElement,
    processTaxonomyElement,
} from '../utils/helpers';
import { processItemsOfType, processSharedRichTextComponents } from './getProcessedData';
import { getSchemaDataFromLinkedItemElement, getSchemaDataFromRichTextElement } from './schemaGetters';
import RichTextField = Fields.RichTextField;

export const getWrappedData = <T extends ISystemAttributes>(dataObject: T, item: ContentItem): IWrappedData<T> => ({
    codename: item.system.codename,
    data: dataObject,
});

export const getSystemProperties = (item: ContentItem): ISystemAttributes => ({
    contentType: item.system.type,
    id: item.system.id,
});

export const getApiSpecificationData = (item: ZapiSpecification, dataBlob: IPreprocessedData, linkedItems: ContentItem[]): IWrappedData<IZapiSpecification> => {
    processItemsOfType<ICategory>(
        getCategoriesData,
        insertDataArrayIntoBlob)
    (item.categories, dataBlob, linkedItems);

    processItemsOfType<IContact>(
        getContactData,
        insertDataIntoBlob)
    (item.contact, dataBlob, linkedItems);

    processItemsOfType<ILicense>(
        getLicenseData,
        insertDataIntoBlob)
    (item.license, dataBlob, linkedItems);

    processItemsOfType<IPathOperation>(
        getPathOperationsData,
        insertDataArrayIntoBlob)
    (item.pathOperations, dataBlob, linkedItems);

    processItemsOfType<ISecurityScheme>(
        getSecuritySchemeData,
        insertDataIntoBlob)
    (item.security, dataBlob);

    processItemsOfType<IServer>(
        getServersData,
        insertDataArrayIntoBlob)
    (item.servers as RichTextField, dataBlob, linkedItems);

    processSharedRichTextComponents(item.description, dataBlob, linkedItems);

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

    return getWrappedData<IZapiSpecification>(dataObject, item);
};

export const getSecuritySchemeData = (items: ZapiSecurityScheme[]): IWrappedData<ISecurityScheme> => {
    if (items.length === 0) {
        return undefined;
    }

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

    return getWrappedData<ISecurityScheme>(dataObject, securityScheme);
};

export const getLicenseData = (items: ZapiLicense[]): IWrappedData<ILicense> => {
    if (items.length === 1) {
        const licenseItem = items[0];
        const dataObject: ILicense = {
            ...getSystemProperties(licenseItem),
            apiReference: processTaxonomyElement(licenseItem.apiReference),
            name: licenseItem.name.value,
            url: licenseItem.url.value,
        };

        return getWrappedData<ILicense>(dataObject, licenseItem);
    }
};

export const getContactData = (items: ZapiContact[]): IWrappedData<IContact> => {
    if (items.length === 1) {
        const contactItem = items[0];
        const dataObject: IContact = {
            ...getSystemProperties(contactItem),
            apiReference: processTaxonomyElement(contactItem.apiReference),
            email: contactItem.email.value,
            name: contactItem.name.value,
            url: contactItem.url.value,
        };

        return getWrappedData<IContact>(dataObject, contactItem);
    }
};

export const getCategoriesData = (items: ZapiCategory[], dataBlob: IPreprocessedData, linkedItems: ContentItem[]): Array<IWrappedData<ICategory>> => {
    const categories = [];
    items.map((category: ZapiCategory) => {
        processSharedRichTextComponents(category.description, dataBlob, linkedItems);
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

export const getPathOperationsData = (items: ZapiPathOperation[], dataBlob: IPreprocessedData, linkedItems: ContentItem[]): Array<IWrappedData<IPathOperation>> => {
    const paths = [];

    items.map((pathOperation: ZapiPathOperation) => {
        // Category items already processed within the zAPI Specification object
        processItemsOfType<IParameter>(
            getParametersData,
            insertDataArrayIntoBlob)
        (pathOperation.parameters, dataBlob, linkedItems);
        processItemsOfType<IRequestBody>(
            getRequestBodiesData,
            insertDataArrayIntoBlob)
        (pathOperation.requestBody, dataBlob, linkedItems);
        processItemsOfType<IResponse>(
            getResponsesData,
            insertDataArrayIntoBlob)
        (pathOperation.responses, dataBlob, linkedItems);

        processSharedRichTextComponents(pathOperation.description, dataBlob, linkedItems);

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

export const getServersData = (field: RichTextField, dataBlob: IPreprocessedData, linkedItems: ContentItem[]): Array<IWrappedData<IServer>> => {
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

export const getParametersData = (items: ZapiParameter[], dataBlob: IPreprocessedData, linkedItems: ContentItem[]): Array<IWrappedData<IParameter>> => {
    const parameters = [];

    items.map((parameter: ZapiParameter) => {
        processItemsOfType<ISchemas>(
            getSchemaDataFromLinkedItemElement,
            insertDataArrayIntoBlob)
        (parameter.schema, dataBlob, linkedItems);
        processSharedRichTextComponents(parameter.description, dataBlob, linkedItems);

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

export const getRequestBodiesData = (field: RichTextField, dataBlob: IPreprocessedData, linkedItems: ContentItem[]): Array<IWrappedData<IRequestBody>> => {
    const requestBodies = [];

    field.linkedItemCodenames.map((codename: string) => {
        const requestBody = getFromLinkedItems<ZapiRequestBody>(codename, linkedItems);

        processItemsOfType<ISchemas>(
            getSchemaDataFromRichTextElement,
            insertDataArrayIntoBlob)
        (requestBody.schema, dataBlob, linkedItems);

        processSharedRichTextComponents(requestBody.description, dataBlob, linkedItems);

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

export const getResponsesData = (field: RichTextField, dataBlob: IPreprocessedData, linkedItems: ContentItem[]): Array<IWrappedData<IResponse>> => {
    const responses = [];

    field.linkedItemCodenames.map((codename: string) => {
        const response = getFromLinkedItems<ZapiResponse>(codename, linkedItems);

        processItemsOfType<IParameter>(
            getParametersData,
            insertDataArrayIntoBlob)
        (response.headers, dataBlob, linkedItems);
        processItemsOfType<ISchemas>(
            getSchemaDataFromRichTextElement,
            insertDataArrayIntoBlob)
        (response.schema, dataBlob, linkedItems);

        processSharedRichTextComponents(response.description, dataBlob, linkedItems);

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

export const getImagesData = (field: RichTextField, dataBlob: IPreprocessedData, linkedItems: ContentItem[]): Array<IWrappedData<IImage>> => {
    const images: Array<IWrappedData<IImage>> = [];
    field.linkedItemCodenames.map((codename: string) => {
        const linkedItem = getFromLinkedItems<Image>(codename, linkedItems);
        if (linkedItem && linkedItem.image && linkedItem.description) {
            const dataObject: IImage = {
                ...getSystemProperties(linkedItem),
                border: processMultipleChoiceElement(linkedItem.border),
                description: linkedItem.description.getHtml(),
                image: linkedItem.image.value,
                imageWidth: processMultipleChoiceElement(linkedItem.imageWidth),
                url: linkedItem.url.value,
                zoomable: processMultipleChoiceElement(linkedItem.zoomable),
            };

            images.push(getWrappedData<IImage>(dataObject, linkedItem));
        }
    });

    return images;
};

export const getCalloutsData = (field: RichTextField, dataBlob: IPreprocessedData, linkedItems: ContentItem[]): Array<IWrappedData<ICallout>> => {
    const callouts: Array<IWrappedData<ICallout>> = [];
    field.linkedItemCodenames.map((codename: string) => {
        const linkedItem = getFromLinkedItems<Callout>(codename, linkedItems);
        if (linkedItem && linkedItem.content && linkedItem.type) {
            const dataObject: ICallout = {
                ...getSystemProperties(linkedItem),
                content: linkedItem.content.getHtml(),
                type: processMultipleChoiceElement(linkedItem.type),
            };

            callouts.push(getWrappedData<ICallout>(dataObject, linkedItem));
        }
    });

    return callouts;
};

export const getSampleItemsData = (field: RichTextField, dataBlob: IPreprocessedData, linkedItems: ContentItem[]): Array<IWrappedData<ICodeSample>> => {
    const codeSampleItems = [];

    field.linkedItemCodenames.map((codename: string) => {
        const linkedItem = getFromLinkedItems<CodeSample>(codename, linkedItems);
        if (linkedItem && linkedItem.code && linkedItem.platform && linkedItem.programmingLanguage) {
            const dataObject: ICodeSample = {
                ...getSystemProperties(linkedItem),
                code: linkedItem.code.value,
                platform: processTaxonomyElement(linkedItem.platform),
                programmingLanguage: processTaxonomyElement(linkedItem.programmingLanguage),
            };

            codeSampleItems.push(getWrappedData<ICodeSample>(dataObject, linkedItem));
        }
    });

    return codeSampleItems;
};

export const getSamplesItemsData = (field: RichTextField, dataBlob: IPreprocessedData, linkedItems: ContentItem[]): Array<IWrappedData<ICodeSamples>> => {
    const codeSamplesItems = [];

    field.linkedItemCodenames.map((codename: string) => {
        const linkedItem = getFromLinkedItems<CodeSamples>(codename, linkedItems);
        if (linkedItem && linkedItem.codeSamples) {
            const dataObject: ICodeSamples = {
                ...getSystemProperties(linkedItem),
                codeSamples: processLinkedItemsElement(linkedItem.codeSamples),
            };

            codeSamplesItems.push(getWrappedData<ICodeSamples>(dataObject, linkedItem));
        }
    });

    return codeSamplesItems;
};
