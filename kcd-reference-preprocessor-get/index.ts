import { AzureFunction, Context } from '@azure/functions';
import { IEventGridEvent } from 'cloud-docs-shared-code';
import { ReferenceOperation } from 'cloud-docs-shared-code/reference/preprocessedModels';
import { IDeliveryClient } from 'kentico-cloud-delivery';

import { Configuration } from '../shared/external/configuration';
import { getDeliveryClient, getPreviewDeliveryClient } from '../shared/external/kenticoCloudClient';
import { ProcessedSchemaCodenames } from '../shared/processing/ProcessedSchemaCodenames';
import { processRootItem } from '../shared/processRootItem';

export interface IProviderInput {
  readonly apiReference: string;
  readonly isTest: string;
}

const eventGridTriggerGet: AzureFunction = async (
  context: Context,
  eventGridEvent: IEventGridEvent<IProviderInput>
): Promise<void> => {
  try {
    Configuration.set(eventGridEvent.data.isTest === 'enabled');

    ProcessedSchemaCodenames.initialize();

    const getClient: () => IDeliveryClient =
      eventGridEvent.eventType === ReferenceOperation.Preview ? getPreviewDeliveryClient : getDeliveryClient;

    const data = await processRootItem(
      eventGridEvent.data.apiReference,
      eventGridEvent.eventType as ReferenceOperation,
      getClient
    );

    context.res = {
      body: data
    };
  } catch (error) {
    /** This try-catch is required for correct logging of exceptions in Azure */
    throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
  }
};

export default eventGridTriggerGet;
