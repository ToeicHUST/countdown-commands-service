import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventPublisherModule } from '@toeichust/common';
import { TargetRepositoryPort } from '../core/application/ports/data-access/repositories/target.repository.port/target.repository.port';
import { TargetEntity } from './data-access/entities/target.entity/target.entity';
import { TargetOrmRepository } from './data-access/repositories/target.orm-repository/target.orm-repository';

export const TargetInfrastructure = {
  imports: [
    HttpModule,
    EventPublisherModule,
    TypeOrmModule.forFeature([TargetEntity]),
  ],
  providers: [
    {
      provide: TargetRepositoryPort,
      useClass: TargetOrmRepository,
    },
  ],
};
