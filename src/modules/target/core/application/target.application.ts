import { CqrsModule } from '@nestjs/cqrs';
import { UpdateTargetCommandHandler } from './commands/update-target/update-target.command-handler/update-target.command-handler';
import { TargetUpdatedEventHandler } from './event-handlers/target-updated/target-updated.event-handler/target-updated.event-handler';

const TargetCommandHandlers: any[] = [UpdateTargetCommandHandler];
const TargetEventHandlers: any[] = [TargetUpdatedEventHandler];

export const TargetApplications = {
  imports: [CqrsModule],
  providers: [...TargetCommandHandlers, ...TargetEventHandlers],
};
