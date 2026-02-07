import { Type } from '@nestjs/common';
import {
  CqrsModule,
  type ICommandHandler,
  type IEventHandler,
} from '@nestjs/cqrs';
import { UpdateTargetCommandHandler } from './commands/update-target/update-target.command-handler/update-target.command-handler';
import { TargetUpdatedEventHandler } from './event-handlers/target-updated/target-updated.event-handler/target-updated.event-handler';

const TargetCommandHandlers: Type<ICommandHandler>[] = [
  UpdateTargetCommandHandler,
];
const TargetEventHandlers: Type<IEventHandler>[] = [TargetUpdatedEventHandler];

export const TargetApplications = {
  imports: [CqrsModule],
  providers: [...TargetCommandHandlers, ...TargetEventHandlers],
};
