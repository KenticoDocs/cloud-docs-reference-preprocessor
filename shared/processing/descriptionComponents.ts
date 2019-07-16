import {
    ICallout,
    ICodeSample,
    ICodeSamples,
    IContentChunk,
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
import { ContentChunk } from '../models/content_chunk';
import { Image } from '../models/image';
import {
    processLinkedItemsElement,
    processMultipleChoiceElement,
    processTaxonomyElement,
} from '../utils/processElements';
import {
    getItemsDataFromRichText,
    getSystemProperties,
    processItems,
} from './common';
import RichTextField = Fields.RichTextField;

type ZapiDescriptionComponents = Image | Callout | CodeSample | CodeSamples | ContentChunk;
type IDescriptionComponents = IImage | ICallout | ICodeSample | ICodeSamples | IContentChunk;

export const processDescriptionComponents = (
    field: RichTextField,
    dataBlob: IPreprocessedData,
    linkedItems: ContentItem[],
): void => processItems(
    getItemsDataFromRichText<ZapiDescriptionComponents, IDescriptionComponents>(getDescriptionComponentData),
)(field, dataBlob, linkedItems);

const getDescriptionComponentData = (component: ZapiDescriptionComponents): IDescriptionComponents => {
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
            return getCodeSamplesData(component as CodeSamples);
        }
        case 'content_chunk': {
            return getContentChunkData(component as ContentChunk);
        }
        default:
            throw Error(`Unsupported content type (${component.system.type}) in a description element`);
    }
};

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

const getCodeSamplesData = (codeSamples: CodeSamples): ICodeSamples => ({
    ...getSystemProperties(codeSamples),
    codeSamples: processLinkedItemsElement(codeSamples.codeSamples),
});

const getContentChunkData = (contentChunk: ContentChunk): IContentChunk => ({
    ...getSystemProperties(contentChunk),
    content: contentChunk.content.getHtml(),
    platform: processTaxonomyElement(contentChunk.platform),
});
