import {AzureFunction, Context} from '@azure/functions';
import {Configuration, IWebhookEventGridEvent} from 'cloud-docs-shared-code';
import {IPreprocessedData, Operation} from 'cloud-docs-shared-code/reference/preprocessedModels';
import {RootItemType} from '../shared/external/kenticoCloudClient';
import {ProcessedSchemaCodenames} from '../shared/processing/ProcessedSchemaCodenames';
import {processRootItem} from '../shared/processRootItem';
import {getCodenamesOfRootItems} from './getCodenamesOfRootItems';
import {triggerReferenceUpdateStarter} from './triggerReferenceUpdateStarter';

export interface IEventGridCredentials {
  readonly host: string;
  readonly eventGridKey: string;
}

export const eventGridTriggerUpdate: AzureFunction = async (
  context: Context,
  eventGridEvent: IWebhookEventGridEvent
): Promise<void> => {
  try {
    Configuration.set(eventGridEvent.data.test === 'enabled');
    ProcessedSchemaCodenames.initialize();

    const rootItemsCodenames: Set<string> = await getCodenamesOfRootItems(eventGridEvent.data.webhook.items);

    const eventGridTopicCredentials = getEventGridTopicCredentials();

    if (rootItemsCodenames.size > 0 && shouldProviderBeTriggered(eventGridEvent)) {
      await triggerReferenceUpdateStarter(eventGridTopicCredentials, rootItemsCodenames);
    }

    const processRootItemFunctions: Promise<IPreprocessedData>[] =
      [...rootItemsCodenames]
        .map(codename => processRootItem(
          codename,
          Operation.Update,
          getZapiSpecificationId(eventGridEvent)
        ));

    await Promise.all(processRootItemFunctions);
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

const getEventGridTopicCredentials = (): IEventGridCredentials => {
  const eventGridKey = process.env['EventGrid.TriggerReferenceUpdateStarter.Key'];
  const host = process.env['EventGrid.TriggerReferenceUpdateStarter.Endpoint'];
  if (!eventGridKey || !host) {
    throw new Error('EventGrid env properties not provided.');
  }

  return {
    eventGridKey,
    host
  };
};
