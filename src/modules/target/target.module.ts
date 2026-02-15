import { Module } from '@nestjs/common';
import { TargetApi } from './api/target.api';
import { TargetApplication } from './core/application/target.application';
import { TargetInfrastructure } from './infrastructure/target.infrastructure';

@Module({
  imports: [...TargetInfrastructure.imports, ...TargetApplication.imports],
  controllers: [...TargetApi.controllers],
  providers: [
    ...TargetApi.resolvers,
    ...TargetInfrastructure.providers,
    ...TargetApplication.providers,
  ],
  exports: [],
})
export class TargetModule {}
