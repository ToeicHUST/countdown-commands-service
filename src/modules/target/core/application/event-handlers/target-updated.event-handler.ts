import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventPublisherPort, TargetUpdatedEvent } from '@toeichust/common';

@EventsHandler(TargetUpdatedEvent)
export class TargetUpdatedEventHandler implements IEventHandler<TargetUpdatedEvent> {
  private readonly logger = new Logger(TargetUpdatedEventHandler.name);

  constructor(private readonly eventPublisherPort: EventPublisherPort) {}

  async handle(event: TargetUpdatedEvent): Promise<void> {
    try {
      this.logger.debug(`event: ${JSON.stringify(event)}`);

      await this.eventPublisherPort.publish(event);

      this.logger.log(`Event published successfully.`);
    } catch (error) {
      this.logger.error(`error: ${error.message}`, error.stack);
    }
  }
}
