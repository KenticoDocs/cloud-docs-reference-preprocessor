import { AzureFunction, Context } from '@azure/functions';
import { Configuration, IEventGridEvent } from 'kontent-docs-shared-code';
import { Operation } from 'kontent-docs-shared-code/reference/preprocessedModels';
import { initializeProcessedSchemaCodenames } from '../shared/processing/ProcessedSchemaCodenames';
import { processRootItem } from '../shared/processRootItem';

export interface IProviderInput {
  readonly apiReference: string;
  readonly isTest: string;
}

export const eventGridTriggerGet: AzureFunction = async (
  context: Context,
  eventGridEvent: IEventGridEvent<IProviderInput>
): Promise<void> => {
  try {
    Configuration.set(eventGridEvent.data.isTest === 'enabled');

    initializeProcessedSchemaCodenames(eventGridEvent.data.apiReference);

    const data = await processRootItem(
      eventGridEvent.data.apiReference,
      eventGridEvent.eventType as Operation
    );

    context.res = {
      body: data
    };
  } catch (error) {
    /** This try-catch is required for correct logging of exceptions in Azure */
    throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
  }
};
