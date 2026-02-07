export abstract class PublisherEventPort {
  abstract publish(
    eventName: string,
    payload: Record<string, any>,
  ): Promise<void>;
}
