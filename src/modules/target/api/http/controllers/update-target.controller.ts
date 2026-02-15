import { Body, Controller, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Auth, CurrentUserId } from '@toeichust/common';
import { UpdateTargetCommand } from '../../../core/application/commands/update-target.command';
import { UpdateTargetRequestDto } from '../dto/request.dto/update-target.request.dto';
import { UpdateTargetResponseDto } from '../dto/response.dto/update-target.response.dto';

@Controller('target')
export class UpdateTargetController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  @Auth.User()
  async updateTarget(
    @CurrentUserId() learnerId: string,
    @Body() payload: UpdateTargetRequestDto,
  ): Promise<UpdateTargetResponseDto> {
    const result = await this.commandBus.execute(
      new UpdateTargetCommand(
        learnerId,
        payload.scoreValue,
        payload.targetDate,
      ),
    );

    return new UpdateTargetResponseDto({
      message: 'Target updated successfully',
      data: {
        id: result.data.id,
        learnerId: result.data.learnerId,
        score: result.data.score.value,
        targetDate: result.data.targetDate,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt,
      },
    });
  }
}
