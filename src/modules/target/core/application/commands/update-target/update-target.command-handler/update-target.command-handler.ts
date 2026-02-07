import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Score, TargetUpdatedEvent } from '@toeichust/common';
import { Target } from '../../../../domain/entities/target/target';
import { TargetFactory } from '../../../../domain/factories/target.factory/target.factory';
import { TargetRepositoryPort } from '../../../ports/data-access/repositories/target.repository.port/target.repository.port';
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
  ): Promise<{ message: string; data: Target }> {
    try {
      this.logger.debug(`payload: ${JSON.stringify(payload)}`);

      let target = await this.targetRepository.getOneByUserId(payload.userId);

      if (target) {
        this.logger.log(
          `Target found for userId: ${payload.userId}. Updating...`,
        );

        target.updateTarget(
          payload.userId,
          new Score(payload.scoreValue),
          payload.targetDate,
        );
      } else {
        this.logger.log(
          `Target not found for userId: ${payload.userId}. Creating new...`,
        );
        target = TargetFactory.create(
          payload.userId,
          new Score(payload.scoreValue),
          payload.targetDate,
        );
      }

      const savedTarget = await this.targetRepository.save(target);

      this.logger.log(`Target saved successfully: ${savedTarget.id}`);

      this.eventBus.publish(
        new TargetUpdatedEvent(
          savedTarget.id,
          savedTarget.userId,
          savedTarget?.score?.value ?? null,
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
