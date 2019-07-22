import {
    ICallout,
    ICodeSample,
    ICodeSamples,
    IImage,
    IPreprocessedData,
} from 'cloud-docs-shared-code/reference/preprocessedModels';
import {
    ContentItem,
    Fields,
} from 'kentico-cloud-delivery';
import { Callout } from '../models/callout';
import { CodeSample } from '../models/code_sample';
import { CodeSamples } from '../models/code_samples';
import { Image } from '../models/image';
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
import RichTextField = Fields.RichTextField;

type ZapiDescriptionComponents = Image | Callout | CodeSample | CodeSamples;
type IDescriptionComponents = IImage | ICallout | ICodeSample | ICodeSamples;

export const processCodeSamplesInLinkedItems = (
    items: ContentItem[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromLinkedItems<CodeSamples, ICodeSamples>(getCodeSamplesData),
)(items, dataBlob, linkedItems);

export const processDescriptionComponents = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromRichText<ZapiDescriptionComponents, IDescriptionComponents>(getDescriptionComponentData),
)(field, dataBlob, linkedItems);

const getDescriptionComponentData = (
    component: ZapiDescriptionComponents,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): IDescriptionComponents => {
    switch (component.system.type) {
        case 'image': {
            return getImageData(component as Image);
        }
        case 'callout': {
            return getCalloutData(component as Callout);
        }
        case 'code_sample': {
            return getCodeSampleData(component as CodeSample);
        }
        case 'code_samples': {
            return getCodeSamplesData(component as CodeSamples, dataBlob, linkedItems);
        }
        default:
            // Content chunk is directly resolved by its richTextResolver
            if (component.system.type !== 'content_chunk') {
                throw Error(`Unsupported content type (${component.system.type}) in a description element`);
            }
    }
};

const processCodeSamples = (
    items: ContentItem[],
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromLinkedItems<CodeSample, ICodeSample>(getCodeSampleData),
)(items, dataBlob, linkedItems);

const getImageData = (image: Image): IImage => ({
    ...getSystemProperties(image),
    border: processMultipleChoiceElement(image.border),
    description: image.description.getHtml(),
    image: image.image.value,
    imageWidth: processMultipleChoiceElement(image.imageWidth),
    url: image.url.value,
    zoomable: processMultipleChoiceElement(image.zoomable),
});

export const getCalloutData = (callout: Callout): ICallout => ({
    ...getSystemProperties(callout),
    content: callout.content.getHtml(),
    type: processMultipleChoiceElement(callout.type),
});

const getCodeSampleData = (codeSample: CodeSample): ICodeSample => ({
    ...getSystemProperties(codeSample),
    code: codeSample.code.value,
    platform: processTaxonomyElement(codeSample.platform),
    programmingLanguage: processTaxonomyElement(codeSample.programmingLanguage),
});

const getCodeSamplesData = (
    item: CodeSamples,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): ICodeSamples => {
    processCodeSamples(item.codeSamples, dataBlob, linkedItems);

    return {
        ...getSystemProperties(item),
        codeSamples: processLinkedItemsElement(item.codeSamples),
    };
};
