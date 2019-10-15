import {AzureFunction, Context} from '@azure/functions';
import {
  Configuration,
  IWebhookEventGridEvent,
  Operation
} from 'kontent-docs-shared-code';
import {getEventGridTopicCredentials} from '../shared/external/getEventGridTopicCredentials';
import {RootItemType} from '../shared/external/kenticoCloudClient';
import {initializeProcessedSchemaCodenames} from '../shared/processing/ProcessedSchemaCodenames';
import {processRootItem} from '../shared/processRootItem';
import {getCodenamesOfRootItems} from './getCodenamesOfRootItems';
import {triggerReferenceUpdateStarter} from './triggerReferenceUpdateStarter';

export const eventGridTriggerUpdate: AzureFunction = async (
  context: Context,
  eventGridEvent: IWebhookEventGridEvent
): Promise<void> => {
  try {
    Configuration.set(eventGridEvent.data.test === 'enabled');

    const rootItemsCodenames: Set<string> = await getCodenamesOfRootItems(eventGridEvent.data.webhook.items);

    const eventGridTopicCredentials = getEventGridTopicCredentials();

    if (rootItemsCodenames.size > 0 && shouldProviderBeTriggered(eventGridEvent)) {
      await triggerReferenceUpdateStarter(eventGridTopicCredentials, rootItemsCodenames, Operation.Update);
    }

    for (const codename of rootItemsCodenames) {
      initializeProcessedSchemaCodenames(codename);

      await processRootItem(
        codename,
        Operation.Update,
        getZapiSpecificationId(eventGridEvent)
      );
    }
  } catch (error) {
    /** This try-catch is required for correct logging of exceptions in Azure */
    throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
  }
};

const shouldProviderBeTriggered = (eventGridEvent: IWebhookEventGridEvent): boolean =>
  eventGridEvent.subject !== 'unpublish' &&
  eventGridEvent.subject !== 'archive';

const getZapiSpecificationId = (eventGridEvent: IWebhookEventGridEvent): string => {
  const zapiSpecification = eventGridEvent.data.webhook.items
    .find(item => item.type === RootItemType);

  return zapiSpecification
    ? zapiSpecification.id
    : undefined;
};
