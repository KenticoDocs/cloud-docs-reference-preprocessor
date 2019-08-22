import { AzureFunction, Context } from '@azure/functions';
import { IWebhookEventGridEvent } from 'cloud-docs-shared-code';
import { IPreprocessedData, ReferenceOperation } from 'cloud-docs-shared-code/reference/preprocessedModels';

import { Configuration } from '../shared/external/configuration';
import { getDeliveryClient } from '../shared/external/kenticoCloudClient';
import { ProcessedSchemaCodenames } from '../shared/processing/ProcessedSchemaCodenames';
import { processRootItem } from '../shared/processRootItem';
import { getCodenamesOfRootItems } from './getCodenamesOfRootItems';

const eventGridTriggerUpdate: AzureFunction = async (
  context: Context,
  eventGridEvent: IWebhookEventGridEvent
): Promise<void> => {
  try {
    Configuration.set(eventGridEvent.data.test === 'enabled');

    ProcessedSchemaCodenames.initialize();

    const rootItemsCodenames: Set<string> = await getCodenamesOfRootItems(eventGridEvent.data.webhook.items);
    const processRootItemFunctions: Promise<IPreprocessedData>[] = [...rootItemsCodenames].map(codename =>
      processRootItem(codename, ReferenceOperation.Update, getDeliveryClient)
    );

    await Promise.all(processRootItemFunctions);
  } catch (error) {
    /** This try-catch is required for correct logging of exceptions in Azure */
    throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
  }
};

export default eventGridTriggerUpdate;
