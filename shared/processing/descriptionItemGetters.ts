import {
    ContentItem,
    Fields,
} from 'kentico-cloud-delivery';
import { Callout } from '../models/callout';
import { CodeSample } from '../models/code_sample';
import { CodeSamples } from '../models/code_samples';
import { Image } from '../models/image';
import {
    ICallout,
    ICodeSample,
    ICodeSamples,
    IImage,
    IPreprocessedData,
    IWrappedItem,
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
} from './common';
import RichTextField = Fields.RichTextField;

export type ZapiDescriptionComponents = Image | Callout | CodeSample | CodeSamples;
export type IDescriptionComponents = IImage | ICallout | ICodeSample | ICodeSamples;

export const getDescriptionItemsData = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): Array<IWrappedItem<IDescriptionComponents>> => {
    const schemas = [];

    field.linkedItemCodenames.map((codename: string) => {
        const schema = getFromLinkedItems<ZapiDescriptionComponents>(codename, linkedItems);

        schemas.push(getDescriptionComponentData(schema));
    });

    return schemas;
};

const getDescriptionComponentData = (
    component: ZapiDescriptionComponents,
): IWrappedItem<IDescriptionComponents> | undefined => {
    switch (component.system.type) {
        case 'image': {
            return getImageData(component as Image);
        }
        case 'callout': {
            return getCalloutData(component as Callout);
        }
        case 'code_sample': {
            return getCodeSampleData(component as Callout);
        }
        case 'code_samples': {
            return getCodeSamplesData(component as CodeSamples);
        }
        default:
            return undefined;
    }
};

const getImageData = (image: Image): IWrappedItem<IImage> => {
    const dataObject: IImage = {
        ...getSystemProperties(image),
        border: processMultipleChoiceElement(image.border),
        description: image.description.getHtml(),
        image: image.image.value,
        imageWidth: processMultipleChoiceElement(image.imageWidth),
        url: image.url.value,
        zoomable: processMultipleChoiceElement(image.zoomable),
    };

    return getWrappedData<IImage>(dataObject, image);
};

const getCalloutData = (callout: Callout): IWrappedItem<ICallout> => {
    const dataObject: ICallout = {
        ...getSystemProperties(callout),
        content: callout.content.getHtml(),
        type: processMultipleChoiceElement(callout.type),
    };

    return getWrappedData<ICallout>(dataObject, callout);
};

const getCodeSampleData = (codeSample: Callout): IWrappedItem<ICodeSample> => {
    const dataObject: ICodeSample = {
        ...getSystemProperties(codeSample),
        code: codeSample.code.value,
        platform: processTaxonomyElement(codeSample.platform),
        programmingLanguage: processTaxonomyElement(codeSample.programmingLanguage),
    };

    return getWrappedData<ICodeSample>(dataObject, codeSample);
};

const getCodeSamplesData = (codeSamples: CodeSamples): IWrappedItem<ICodeSamples> => {
    const dataObject: ICodeSamples = {
        ...getSystemProperties(codeSamples),
        codeSamples: processLinkedItemsElement(codeSamples.codeSamples),
    };

    return getWrappedData<ICodeSamples>(dataObject, codeSamples);
};
