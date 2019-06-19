import { ContentItem } from 'kentico-cloud-delivery';
import { Callout } from '../models/callout';
import { CodeSample } from '../models/code_sample';
import { CodeSamples } from '../models/code_samples';
import { ZapiCategory } from '../models/zapi_category';
import { ZapiParameter } from '../models/zapi_parameter';
import { ZapiPathOperation } from '../models/zapi_path_operation';
import { ZapiRequestBody } from '../models/zapi_request_body';
import { ZapiResponse } from '../models/zapi_response';
import { ZapiResponseContainer } from '../models/zapi_response_container';
import { ZapiResponseContent } from '../models/zapi_response_content';
import { ZapiServer } from '../models/zapi_server';
import { ZapiSpecification } from '../models/zapi_specification';
import {
    ICallout,
    ICategory,
    ICodeSample,
    ICodeSamples,
    IContact,
    IDataObject,
    ILicense,
    IParameter,
    IPath,
    IRequestBody,
    IResponse,
    IResponseContainer,
    IResponseContent,
    ISecurityScheme,
    IServer,
    ISystemAttributes,
    IWrappedData,
    IZapiSpecification,
} from '../types/dataModels';
import {
    getFromLinkedItems,
    insertDataArrayIntoBlob,
    processLinkedItemsElement,
    processMultipleChoiceElement,
    processTaxonomyElement,
} from '../utils/helpers';
import { processItemsOfType, processSharedRichTextComponents } from './getProcessedData';

export const getApiSpecificationData = (item: ZapiSpecification): IZapiSpecification => ({
    apiReference: processTaxonomyElement(item.apiReference),
    categories: processLinkedItemsElement(item.categories),
    codename: item.system.codename,
    contact: processLinkedItemsElement(item.contact),
    description: item.description.getHtml(),
    featureReleaseStatus: processTaxonomyElement(item.featureReleaseStatus),
    id: item.system.id,
    license: processLinkedItemsElement(item.license),
    paths: processLinkedItemsElement(item.paths),
    security: processLinkedItemsElement(item.security),
    servers: item.servers.getHtml(),
    termsOfService: item.termsOfService.value,
    title: item.title.value,
    url: item.url.value,
    version: item.version.value,
});

export const getWrappedData = <T extends ISystemAttributes>(dataObject: T, item: ContentItem): IWrappedData<T> => ({
    codename: item.system.codename,
    data: dataObject,
});

export const getSecuritySchemeData = (item: ZapiSpecification): IWrappedData<ISecurityScheme> => {
    const securityScheme = item.security[0];
    const dataObject: ISecurityScheme = {
        apiReference: processTaxonomyElement(securityScheme.apiReference),
        bearerFormat: securityScheme.bearerformat.value,
        contentType: securityScheme.system.type,
        description: securityScheme.description.getHtml(),
        id: securityScheme.system.id,
        in: securityScheme.in.value,
        name: securityScheme.name.value,
        scheme: securityScheme.scheme.value,
        schemeName: securityScheme.schemeName.value,
        type: processMultipleChoiceElement(securityScheme.type),
    };

    return getWrappedData<ISecurityScheme>(dataObject, securityScheme);
};

export const getLicenseData = (item: ZapiSpecification): IWrappedData<ILicense> => {
    if (item.license.length === 1) {
        const licenseItem = item.license[0];
        const dataObject: ILicense = {
            apiReference: processTaxonomyElement(licenseItem.apiReference),
            contentType: licenseItem.system.type,
            id: licenseItem.system.id,
            name: licenseItem.name.value,
            url: licenseItem.url.value,
        };

        return getWrappedData<ILicense>(dataObject, licenseItem);
    }
};

export const getContactData = (item: ZapiSpecification): IWrappedData<IContact> => {
    if (item.contact.length === 1) {
        const contactItem = item.contact[0];
        const dataObject: IContact = {
            apiReference: processTaxonomyElement(contactItem.apiReference),
            contentType: contactItem.system.type,
            email: contactItem.email.value,
            id: contactItem.system.id,
            name: contactItem.name.value,
            url: contactItem.url.value,
        };

        return getWrappedData<IContact>(dataObject, contactItem);
    }
};

export const getCategoriesData = (item: ZapiSpecification, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<ICategory>> => {
    const categories = [];
    item.categories.map((category: ZapiCategory) => {
        processSharedRichTextComponents(category, dataBlob, linkedItems);
        const dataObject: ICategory = {
            apiReference: processTaxonomyElement(category.apiReference),
            contentType: category.system.type,
            description: category.description.getHtml(),
            id: category.system.id,
            name: category.name.value,
        };

        categories.push(getWrappedData<ICategory>(dataObject, category));
    });

    return categories;
};

export const getPathsData = (item: ZapiSpecification, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<IPath>> => {
    const paths = [];

    item.paths.map((pathOperation: ZapiPathOperation) => {
        processItemsOfType<IParameter, ZapiPathOperation>(
            getParametersData, insertDataArrayIntoBlob)(pathOperation, dataBlob, linkedItems);
        processItemsOfType<IRequestBody, ZapiPathOperation>(
            getRequestBodiesData, insertDataArrayIntoBlob)(pathOperation, dataBlob, linkedItems);
        processItemsOfType<IResponseContainer, ZapiPathOperation>(
            getResponseContainersData, insertDataArrayIntoBlob)(pathOperation, dataBlob, linkedItems);

        processSharedRichTextComponents(pathOperation, dataBlob, linkedItems);

        const dataObject: IPath = {
            apiReference: processTaxonomyElement(pathOperation.apiReference),
            category: processLinkedItemsElement(pathOperation.category),
            codeSamples: processLinkedItemsElement(pathOperation.codeSamples),
            contentType: pathOperation.system.type,
            deprecated: processMultipleChoiceElement(pathOperation.deprecated),
            description: pathOperation.description.getHtml(),
            id: pathOperation.system.id,
            parameters: processLinkedItemsElement(pathOperation.parameters),
            path: pathOperation.path.value,
            pathOperation: processTaxonomyElement(pathOperation.pathOperation),
            requestBody: pathOperation.requestBody.getHtml(),
            responses: pathOperation.responses.getHtml(),
            summary: pathOperation.summary.value,
            url: pathOperation.url.value,
        };

        paths.push(getWrappedData(dataObject, pathOperation));
    });

    return paths;
};

export const getServersData = (item: ZapiSpecification, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<IServer>> => {
    const servers = [];

    item.servers.linkedItemCodenames.map((codename: string) => {
        const server = getFromLinkedItems<ZapiServer>(codename, linkedItems);
        const dataObject: IServer = {
            contentType: server.system.type,
            description: server.description.value,
            id: server.system.id,
            url: server.url.value,
        };

        servers.push(getWrappedData<IServer>(dataObject, server));
    });

    return servers;
};

export const getParametersData = (item: ZapiPathOperation, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<IParameter>> => {
    const parameters = [];

    item.parameters.map((parameter: ZapiParameter) => {
        processSharedRichTextComponents(parameter, dataBlob, linkedItems);

        const dataObject: IParameter = {
            apiReference: processTaxonomyElement(parameter.apiReference),
            contentType: parameter.system.type,
            deprecated: processMultipleChoiceElement(parameter.deprecated),
            description: parameter.description.getHtml(),
            example: parameter.example.text,
            explode: processMultipleChoiceElement(parameter.explode),
            id: parameter.system.id,
            in: processMultipleChoiceElement(parameter.in),
            name: parameter.name.value,
            required: processMultipleChoiceElement(parameter.required),
            // TODO process schemas
            schema: processLinkedItemsElement(parameter.schema),
            style: processMultipleChoiceElement(parameter.style),
        };

        parameters.push(getWrappedData<IParameter>(dataObject, parameter));
    });

    return parameters;
};

export const getRequestBodiesData = (item: ZapiPathOperation, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<IRequestBody>> => {
    const requestBodies = [];

    item.requestBody.linkedItemCodenames.map((codename: string) => {
        const requestBody = getFromLinkedItems<ZapiRequestBody>(codename, linkedItems);
        processSharedRichTextComponents(requestBody, dataBlob, linkedItems);

        const dataObject: IRequestBody = {
            contentType: requestBody.system.type,
            description: requestBody.description.getHtml(),
            example: requestBody.example.text,
            id: requestBody.system.id,
            mediaType: requestBody.contentType.value,
            required: processMultipleChoiceElement(requestBody.required),
            // TODO process schemas
            schema: requestBody.schema.getHtml(),
        };

        requestBodies.push(getWrappedData<IRequestBody>(dataObject, requestBody));
    });

    return requestBodies;
};

export const getResponseContainersData = (item: ZapiPathOperation, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<IResponseContainer>> => {
    const responseContainers = [];

    item.responses.linkedItemCodenames.map((codename: string) => {
        const responseContainer = getFromLinkedItems<ZapiResponseContainer>(codename, linkedItems);
        processItemsOfType<IResponse, ZapiResponseContainer>(
            getResponsesData, insertDataArrayIntoBlob)(responseContainer, dataBlob, linkedItems);

        const dataObject: IResponseContainer = {
            contentType: responseContainer.system.type,
            httpStatus: processMultipleChoiceElement(responseContainer.httpStatus),
            id: responseContainer.system.id,
            response: responseContainer.response.getHtml(),
        };

        responseContainers.push(getWrappedData<IResponseContainer>(dataObject, responseContainer));
    });

    return responseContainers;
};

export const getResponsesData = (item: ZapiResponseContainer, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<IResponse>> => {
    const responses = [];

    item.response.linkedItemCodenames.map((codename: string) => {
        const response = getFromLinkedItems<ZapiResponse>(codename, linkedItems);

        processItemsOfType<IResponseContent, ZapiResponse>(
            getResponseContentsData, insertDataArrayIntoBlob)(response, dataBlob, linkedItems);

        processSharedRichTextComponents(response, dataBlob, linkedItems);

        const dataObject: IResponse = {
            apiReference: processTaxonomyElement(response.apiReference),
            content: response.content.getHtml(),
            contentType: response.system.type,
            description: response.description.getHtml(),
            headers: processLinkedItemsElement(response.headers),
            id: response.system.id,
        };

        responses.push(getWrappedData<IResponse>(dataObject, response));
    });

    return responses;
};

export const getResponseContentsData = (item: ZapiResponse, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<IResponseContent>> => {
    const responseContents = [];

    item.content.linkedItemCodenames.map((codename: string) => {
        const responseContent = getFromLinkedItems<ZapiResponseContent>(codename, linkedItems);

        processSharedRichTextComponents(responseContent, dataBlob, linkedItems);

        const dataObject: IResponseContent = {
            contentType: responseContent.system.type,
            example: responseContent.example.value,
            id: responseContent.system.id,
            mediaType: responseContent.contentType.value,
            schema: responseContent.schema.getHtml(),
        };

        responseContents.push(getWrappedData(dataObject, responseContent));
    });

    return responseContents;
};

export const getCalloutsData = (item: any, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<ICallout>> => {
    const callouts: Array<IWrappedData<ICallout>> = [];
    item.description.linkedItemCodenames.map((codename: string) => {
        const callout = getFromLinkedItems<Callout>(codename, linkedItems);
        const dataObject: ICallout = {
            content: callout.content.getHtml(),
            contentType: callout.system.type,
            id: callout.system.id,
            type: processMultipleChoiceElement(callout.type),
        };

        callouts.push(getWrappedData<ICallout>(dataObject, callout));
    });

    return callouts;
};

export const getSampleItemsData = (item: any, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<ICodeSample>> => {
    const codeSampleItems = [];

    item.description.linkedItemCodenames.map((codename: string) => {
        const codeSample = getFromLinkedItems<CodeSample>(codename, linkedItems);
        const dataObject: ICodeSample = {
            code: codeSample.code.value,
            contentType: codeSample.system.type,
            id: codeSample.system.id,
            platform: processTaxonomyElement(codeSample.platform),
            programmingLanguage: processTaxonomyElement(codeSample.programmingLanguage),
        };

        codeSampleItems.push(getWrappedData<ICodeSample>(dataObject, codeSample));
    });

    return codeSampleItems;
};

export const getSamplesItemsData = (item: any, dataBlob: IDataObject, linkedItems: ContentItem[]): Array<IWrappedData<ICodeSamples>> => {
    const codeSamplesItems = [];

    item.description.linkedItemCodenames.map((codename: string) => {
        const codeSamples = getFromLinkedItems<CodeSamples>(codename, linkedItems);
        const dataObject: ICodeSamples = {
            codeSamples: processLinkedItemsElement(codeSamples.codeSamples),
            contentType: codeSamples.system.type,
            id: codeSamples.system.id,
        };

        codeSamplesItems.push(getWrappedData<ICodeSamples>(dataObject, codeSamples));
    });

    return codeSamplesItems;
};
