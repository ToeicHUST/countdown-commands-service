import { Type } from '@nestjs/common';
import {
  CqrsModule,
  ICommandHandler,
  IEventHandler,
  IQueryHandler,
} from '@nestjs/cqrs';
import { UpdateTargetCommandHandler } from './commands/update-target.command-handler';
import { TargetUpdatedEventHandler } from './event-handlers/target-updated.event-handler';

const commandHandlers: Type<ICommandHandler>[] = [UpdateTargetCommandHandler];

const eventHandlers: Type<IEventHandler>[] = [TargetUpdatedEventHandler];

const queryHandlers: Type<IQueryHandler>[] = [];

export const TargetApplication = {
  imports: [CqrsModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers],
};
