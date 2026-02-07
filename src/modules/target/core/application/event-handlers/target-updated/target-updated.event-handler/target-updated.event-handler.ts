import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TargetUpdatedEvent } from '../../../../domain/events/target-updated.event/target-updated.event';
import { PublisherEventPort } from '../../../ports/event-publisher/repositories/publisher-event.port/publisher-event.port';

@EventsHandler(TargetUpdatedEvent)
export class TargetUpdatedEventHandler implements IEventHandler<TargetUpdatedEvent> {
  private readonly logger = new Logger(TargetUpdatedEventHandler.name);

  constructor(private readonly publisherEventPort: PublisherEventPort) {}

  async handle(event: TargetUpdatedEvent): Promise<void> {
    try {
      this.logger.debug(`event: ${JSON.stringify(event)}`);

      const eventName = 'target-updated';
      const payload = {
        eventName: eventName,

        data: {
          targetId: event.target.id,
          userId: event.target.userId,
          score: event.target.score?.value ?? null,
          targetDate: event.target.targetDate,
          updatedAt: event.target.updatedAt,
        },
      };

      await this.publisherEventPort.publish(eventName, payload);
      this.logger.log(`Event published successfully.`);
    } catch (error) {
      this.logger.error(`error: ${error.message}`, error.stack);
    }
  }
}
