import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EventPublisherPort,
  UpstashQstashEventPublisherAdapter,
  WebhookEventPublisherAdapter,
} from '@toeichust/common';
import { TargetRepositoryPort } from '../core/application/ports/data-access/target.repository.port';
import { TargetEntity } from './data-access/entities/target.entity';
import { TargetOrmRepository } from './data-access/repositories/target.orm-repository';

// const isUseWebhook  = true;
const isUseWebhook = false;


export const TargetInfrastructure = {
  imports: [
    ...(isUseWebhook ? [HttpModule] : []),
    TypeOrmModule.forFeature([TargetEntity]),
  ],
  providers: [
    {
      provide: EventPublisherPort,
      useClass: isUseWebhook
        ? WebhookEventPublisherAdapter
        : UpstashQstashEventPublisherAdapter,
    },
    {
      provide: TargetRepositoryPort,
      useClass: TargetOrmRepository,
    },
  ],
};
