import { ContentItem, Fields } from 'kentico-cloud-delivery';

/**
 * This class was generated by 'kentico-cloud-model-generator-utility' at Thu Jun 13 2019 13:54:14 GMT+0200 (GMT+02:00).
 *
 * Note: You can substitute 'ContentItem' type with another generated class. Generator doesn't have this information available
 * and so its up to you to define relationship between models.
 */
export class ZapiParameter extends ContentItem {
    public schema: ContentItem[];
    public description: Fields.RichTextField;
    public in: Fields.MultipleChoiceField;
    public deprecated: Fields.MultipleChoiceField;
    public example: Fields.TextField;
    public apiReference: Fields.TaxonomyField;
    public style: Fields.MultipleChoiceField;
    public required: Fields.MultipleChoiceField;
    public name: Fields.TextField;
    public explode: Fields.MultipleChoiceField;
    constructor() {
        super({
            propertyResolver: ((fieldName: string) => {
                if (fieldName === 'api_reference') {
                    return 'apiReference';
                }
                return fieldName;
            })
        });
    }
}