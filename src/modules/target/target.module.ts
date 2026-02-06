import { Module } from '@nestjs/common';
import { TargetApplications } from './core/application/target.application';
import { TargetInfrastructure } from './infrastructure/target.infrastructure';
import { TargetPresentation } from './presentation/target.presentation';

@Module({
  imports: [...TargetInfrastructure.imports, ...TargetApplications.imports],
  controllers: [...TargetPresentation.controllers],
  providers: [
    ...TargetPresentation.resolvers,
    ...TargetInfrastructure.providers,
    ...TargetApplications.providers,
  ],
  exports: [],
})
export class TargetModule {}
