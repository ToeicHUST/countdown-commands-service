import { PublisherEventPort } from './publisher-event.port';

describe('PublisherEventPort', () => {
  it('should be an abstract class', () => {
    expect(typeof PublisherEventPort).toBe('function');
    expect(PublisherEventPort.prototype.publish).toBeUndefined();
  });

  it('should be implementable as a concrete class', () => {
    class MockPublisher extends PublisherEventPort {
      async publish(eventName: string, payload: Record<string, any>) {}
    }

    const publisher = new MockPublisher();
    expect(publisher).toBeInstanceOf(PublisherEventPort);
  });
});
