import { EventGridClient, EventGridModels } from 'azure-eventgrid';
import { Operation } from 'cloud-docs-shared-code';
import { TopicCredentials } from 'ms-rest-azure';
import * as url from 'url';
import { v4 as getUuid } from 'uuid';
import {IEventGridCredentials} from './index';

interface IPublishEventsCreatorDeps {
  readonly host: string;
  readonly eventGridClient: EventGridClient;
}

export const triggerReferenceUpdateStarter = async (
  {eventGridKey, host}: IEventGridCredentials,
  rootItemsCodenames: Set<string>
) => {
  const topicCredentials = new TopicCredentials(eventGridKey);
  const eventGridClient = new EventGridClient(topicCredentials);
  const publishEvents = publishEventsCreator({ eventGridClient, host });

  for (const rootItemCodename of rootItemsCodenames) {
    const event = eventComposer(rootItemCodename, Operation.Update);
    await publishEvents([event]);
  }
};

export const publishEventsCreator = (dependencies: IPublishEventsCreatorDeps) =>
  async (events: EventGridModels.EventGridEvent[]): Promise<void> => {
    const referencePropertyHost = url.parse(dependencies.host, true).host;
    if (!referencePropertyHost) {
      throw new Error('Host property is not defined');
    }

    return dependencies.eventGridClient.publishEvents(referencePropertyHost, events);
  };

const eventComposer = (
  apiReferenceCodename: string,
  operation: string
): EventGridModels.EventGridEvent => ({
  data: {
    apiReference: apiReferenceCodename
  },
  dataVersion: '1.0',
  eventTime: new Date(),
  eventType: operation,
  id: getUuid(),
  subject: 'kontent/apiReference'
});
