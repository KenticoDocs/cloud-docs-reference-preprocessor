import { ContentItem } from 'kentico-cloud-delivery';
import {
    getFromLinkedItems,
    processLinkedItemsElement,
    processMultipleChoiceElement,
    processTaxonomyElement,
} from './helpers';
import { ZapiCategory } from './models/zapi_category';
import { ZapiServer } from './models/zapi_server';
import { ZapiSpecification } from './models/zapi_specification';

const preprocessedData = [];

interface IBlobObject {
    readonly webhook: string | any,
    readonly data: IDataObject,
}

interface IDataObject {
    api_specification: any,
    readonly items: any,
}

export const getBlobObject = (operation: string | any): IBlobObject =>
    ({
        data: {
            api_specification: {},
            items: {},
        },
        webhook: operation,
    });

export const getProcessedData = (specifications: ZapiSpecification[], linkedItems: ContentItem[]): IBlobObject[] => {
    specifications.map((item: ZapiSpecification) => {
        preprocessedData.push(getBlobObject('initialize'));
        const dataBlobIndex = preprocessedData.length - 1;
        const currentDataObject = preprocessedData[dataBlobIndex].data;

        processApiSpecification(item, currentDataObject);
        processServerObjects(item, currentDataObject, linkedItems);
        processSecuritySchemeObject(item, currentDataObject);
        processLicenseObject(item, currentDataObject);
        processContactObject(item, currentDataObject);
        processCategories(item, currentDataObject);
    });

    return preprocessedData;
};

const processApiSpecification = (item: ZapiSpecification, dataBlob: IDataObject): void => {
    dataBlob.api_specification = {
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
        value: item.version.value,
    };
};

const processServerObjects = (item: ZapiSpecification, dataBlob: IDataObject, linkedItems: ContentItem[]): void => {
    item.servers.linkedItemCodenames.map((codename: string) => {
        const server = getFromLinkedItems<ZapiServer>(codename, linkedItems);

        dataBlob.items[codename] = {
            contentType: server.system.type,
            description: server.description.value,
            id: server.system.id,
            url: server.url.value,
        };
    });
};

const processSecuritySchemeObject = (item: ZapiSpecification, dataBlob: IDataObject): void => {
    const securityScheme = item.security[0];

    dataBlob.items[securityScheme.system.codename] = {
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
};

const processLicenseObject = (item: ZapiSpecification, dataBlob: IDataObject): void => {
    if (item.license.length === 1) {
        const licenseItem = item.license[0];

        dataBlob.items[licenseItem.system.codename] = {
            apiReference: processTaxonomyElement(licenseItem.apiReference),
            contentType: licenseItem.system.type,
            id: licenseItem.system.id,
            name: licenseItem.name.value,
            url: licenseItem.url.value,
        };
    }
};

const processContactObject = (item: ZapiSpecification, dataBlob: IDataObject): void => {
    if (item.contact.length === 1) {
        const contactItem = item.contact[0];

        dataBlob.items[contactItem.system.codename] = {
            apiReference: processTaxonomyElement(contactItem.apiReference),
            contentType: contactItem.system.type,
            email: contactItem.email.value,
            id: contactItem.system.id,
            name: contactItem.name.value,
            url: contactItem.url.value,
        };
    }
};

const processCategories = (item: ZapiSpecification, dataBlob: IDataObject): void => {
    item.categories.map((category: ZapiCategory) => {
        dataBlob.items[category.system.codename] = {
            apiReference: processTaxonomyElement(category.apiReference),
            contentType: category.system.type,
            description: category.description.getHtml(),
            id: category.system.id,
            name: category.name.value,
        };
    });
};
