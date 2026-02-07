import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TargetRepositoryPort } from '../core/application/ports/data-access/repositories/target.repository.port/target.repository.port';
import { PublisherEventPort } from '../core/application/ports/event-publisher/repositories/publisher-event.port/publisher-event.port';
import { TargetEntity } from './data-access/entities/target.entity/target.entity';
import { TargetOrmRepository } from './data-access/repositories/target.orm-repository/target.orm-repository';
import { EventPublisherAdapter } from './event-publisher/adapters/event-publisher.adapter/event-publisher.adapter';
import { EventPublisherConfig } from './event-publisher/configs/event-publisher.config/event-publisher.config';

export const TargetInfrastructure = {
  imports: [HttpModule, TypeOrmModule.forFeature([TargetEntity])],
  providers: [
    {
      provide: TargetRepositoryPort,
      useClass: TargetOrmRepository,
    },
    EventPublisherConfig,
    {
      provide: PublisherEventPort,
      useClass: EventPublisherAdapter,
    },
  ],
  // exports: [TargetRepositoryPort, PublisherEventPort],
};
