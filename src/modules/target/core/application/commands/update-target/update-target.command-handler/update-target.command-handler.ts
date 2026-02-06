import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Target } from '../../../../domain/entities/target/target';
import { TargetUpdatedEvent } from '../../../../domain/events/target-updated.event/target-updated.event';
import { TargetFactory } from '../../../../domain/factories/target.factory/target.factory';
import { Score } from '../../../../domain/value-objects/score/score';
import { TargetRepositoryPort } from '../../../ports/dataaccess/repositories/target.repository.port/target.repository.port';
import { UpdateTargetCommand } from '../update-target.command/update-target.command';

@CommandHandler(UpdateTargetCommand)
export class UpdateTargetCommandHandler implements ICommandHandler<UpdateTargetCommand> {
  private readonly logger = new Logger(UpdateTargetCommandHandler.name);

  constructor(
    private readonly targetRepository: TargetRepositoryPort,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    payload: UpdateTargetCommand,
  ): Promise<{ message: string; data?: any }> {
    try {
      this.logger.debug(`payload: ${JSON.stringify(payload)}`);

      let target = await this.targetRepository.getOneByUserId(payload.userId);

      let targetSaved: Target;

      if (!target) {
        this.logger.log(
          `Target not found for userId: ${payload.userId}. Creating new target.`,
        );

        const newTarget = TargetFactory.create(
          payload.userId,
          new Score(payload.scoreValue),
          payload.targetDate,
        );

        targetSaved = await this.targetRepository.save(newTarget);
        this.logger.log(`New target created: ${JSON.stringify(targetSaved)}`);
      } else {
        this.logger.log(
          `Target found for userId: ${payload.userId}. Updating target.`,
        );

        target.updateTarget(
          payload.userId,
          new Score(payload.scoreValue),
          payload.targetDate,
        );

        targetSaved = await this.targetRepository.save(target);
        this.logger.log(`Target updated: ${JSON.stringify(targetSaved)}`);
      }

      this.eventBus.publish(new TargetUpdatedEvent(targetSaved));

      return {
        message: 'Target updated successfully.',
        data: targetSaved,
      };
    } catch (error) {
      this.logger.error(`error: ${error.message}`, error.stack);
      return { message: error.message };
    }
  }
}
