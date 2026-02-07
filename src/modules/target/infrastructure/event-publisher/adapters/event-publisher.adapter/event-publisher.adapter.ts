import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PublisherEventPort } from '../../../../core/application/ports/event-publisher/repositories/publisher-event.port/publisher-event.port';
import { EventPublisherConfig } from '../../configs/event-publisher.config/event-publisher.config';

@Injectable()
export class EventPublisherAdapter implements PublisherEventPort {
  private readonly logger = new Logger(EventPublisherAdapter.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly config: EventPublisherConfig,
  ) {}

  async publish(
    eventName: string,
    payload: Record<string, any>,
  ): Promise<void> {
    this.logger.debug(`Sending ${eventName}...`);

    try {
      await firstValueFrom(
        this.httpService.post(
          this.config.MICROSERVICES_WEBHOOK_EVENT_URL,
          { eventName, ...payload },
          {
            headers: {
              'Content-Type': 'application/json',
              // TODO: thêm token
            },
          },
        ),
      );

      this.logger.log(`"${eventName}" delivered successfully.`);
    } catch (error) {
      this.logger.error(`error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
