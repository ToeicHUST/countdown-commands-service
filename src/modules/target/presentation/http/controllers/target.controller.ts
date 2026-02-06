import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Auth, CurrentUserId } from '@toeichust/common';
import { UpdateTargetCommand } from '../../../core/application/commands/update-target/update-target.command/update-target.command';
import { UpdateTargetRequestDto } from '../dtos/request.dto/update-target.request.dto';
import { UpdateTargetResponseDto } from '../dtos/response.dto/update-target.response.dto';

@Controller('target')
export class TargetController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  @Auth.User()
  async updateTarget(
    @CurrentUserId() userId: string,
    @Body() request: UpdateTargetRequestDto,
  ): Promise<UpdateTargetResponseDto> {
    try {
      const result = await this.commandBus.execute<UpdateTargetCommand, any>(
        new UpdateTargetCommand(userId, request.scoreValue, request.targetDate),
      );

      return result;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
