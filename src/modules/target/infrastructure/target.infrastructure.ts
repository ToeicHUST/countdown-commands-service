import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TargetRepositoryPort } from '../core/application/ports/dataaccess/repositories/target.repository.port/target.repository.port';
import { PublisherEventPort } from '../core/application/ports/event-publisher/repositories/publisher-event.port/publisher-event.port';
import { TargetEntity } from './dataaccess/entities/target.entity/target.entity';
import { TargetOrmRepository } from './dataaccess/repositories/target.orm-repository/target.orm-repository';
import { EventPublisherAdapter } from './event-publisher/adapters/event-publisher.adapter/event-publisher.adapter';
import { EventPublisherConfig } from './event-publisher/configs/event-publisher.config/event-publisher.config';

export const TargetInfrastructure = {
  imports: [TypeOrmModule.forFeature([TargetEntity]), HttpModule],
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
  exports: [TargetRepositoryPort, PublisherEventPort],
};
