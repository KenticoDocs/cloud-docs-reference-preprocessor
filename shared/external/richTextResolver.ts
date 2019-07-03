import { ContentItem } from 'kentico-cloud-delivery';

export const resolveItemInRichText = (item: ContentItem): string =>
    (item.system.type === 'content_chunk')
        ? item.content.getHtml()
        : '';
