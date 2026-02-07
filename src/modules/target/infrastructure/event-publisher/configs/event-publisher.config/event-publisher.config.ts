import { Injectable, Logger } from '@nestjs/common';
import { VaultService } from '@toeichust/common';

@Injectable()
export class EventPublisherConfig {
  private readonly logger = new Logger(EventPublisherConfig.name);
  public MICROSERVICES_WEBHOOK_EVENT_URL: string;

  constructor(private readonly vaultService: VaultService) {
    this.MICROSERVICES_WEBHOOK_EVENT_URL = this.vaultService.get<string>(
      'MICROSERVICES_WEBHOOK_EVENT_URL',
    );

    if (!this.MICROSERVICES_WEBHOOK_EVENT_URL) {
      this.logger.warn('MICROSERVICES_WEBHOOK_EVENT_URL is not set!');
    }
  }
}
