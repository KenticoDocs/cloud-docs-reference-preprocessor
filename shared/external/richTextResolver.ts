import { ContentItem } from 'kentico-cloud-delivery';

export const resolveItemInRichText = (item: ContentItem): string => {
    if (item.system.type === 'content_chunk') {
        return item.content.getHtml();
    }

    return '';
};
