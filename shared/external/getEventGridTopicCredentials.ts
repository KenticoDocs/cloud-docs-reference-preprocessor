export interface IEventGridCredentials {
  readonly host: string;
  readonly eventGridKey: string;
}

export const getEventGridTopicCredentials = (): IEventGridCredentials => {
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
