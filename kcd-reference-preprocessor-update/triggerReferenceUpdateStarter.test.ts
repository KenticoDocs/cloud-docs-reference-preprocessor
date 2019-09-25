import { publishEventsCreator } from './triggerReferenceUpdateStarter';

const eventGridClient = {
  publishEvents: jest.fn()
};
const host = 'fake.url-to-webhook.cloud';
const fakeHost = `http://${host}/api/webhook`;
const events = [
  {
    data: { xxx: 'xxx' },
    dataVersion: '1.0',
    eventTime: new Date(),
    eventType: 'test_event',
    subject: 'test'
  }
];

describe('publishEvents', () => {
  test('calls publishEvents with correct host and events', async () => {
    const deps = {
      eventGridClient,
      host: fakeHost
    };

    await publishEventsCreator(deps as any)(events as any);

    expect(eventGridClient.publishEvents.mock.calls[0][0]).toBe(host);
    expect(eventGridClient.publishEvents.mock.calls[0][1]).toBe(events);
  });
});
