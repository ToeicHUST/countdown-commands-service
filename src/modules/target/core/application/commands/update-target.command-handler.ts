import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Score, TargetUpdatedEvent } from '@toeichust/common';
import { Target } from '../../domain/entities/target';
import { TargetFactory } from '../../domain/factories/target.factory';
import { TargetRepositoryPort } from '../ports/data-access/target.repository.port';
import { UpdateTargetCommand } from './update-target.command';

@CommandHandler(UpdateTargetCommand)
export class UpdateTargetCommandHandler implements ICommandHandler<UpdateTargetCommand> {
  private readonly logger = new Logger(UpdateTargetCommandHandler.name);

  constructor(
    private readonly targetRepository: TargetRepositoryPort,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: UpdateTargetCommand,
  ): Promise<{ message: string; data: Target }> {
    try {
      this.logger.debug(`payload: ${JSON.stringify(command)}`);

      let target = await this.targetRepository.getOneByLearnerId(
        command.learnerId,
      );

      if (target) {
        this.logger.log(
          `Target found for learnerId: ${command.learnerId}. Updating...`,
        );

        target.updateTarget(new Score(command.scoreValue), command.targetDate);
      } else {
        this.logger.log(
          `Target not found for learnerId: ${command.learnerId}. Creating new...`,
        );

        target = TargetFactory.createNewTarget(
          command.learnerId,
          new Score(command.scoreValue),
          command.targetDate,
        );
      }

      const savedTarget = await this.targetRepository.save(target);

      this.logger.log(`Target saved successfully: ${savedTarget.id}`);

      this.eventBus.publish(
        new TargetUpdatedEvent(
          savedTarget.id,
          savedTarget.learnerId,
          savedTarget.score.value,
          savedTarget.targetDate,
          savedTarget.createdAt,
          savedTarget.updatedAt,
        ),
      );

      return {
        message: 'Target updated successfully.',
        data: savedTarget,
      };
    } catch (error) {
      this.logger.error(`error: ${error.message}`, error.stack);
      // return { message: error.message };
      throw error;
    }
  }
}
