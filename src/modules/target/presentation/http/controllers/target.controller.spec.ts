import { HttpException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTargetCommand } from '../../../core/application/commands/update-target/update-target.command/update-target.command';
import { DomainException } from '../../../core/domain/exceptions/domain.exception/domain.exception';
import { TargetFactory } from '../../../core/domain/factories/target.factory/target.factory';
import { TargetController } from './target.controller';

describe('TargetController', () => {
  let controller: TargetController;
  let mockCommandBus: { execute: jest.Mock };

  beforeEach(async () => {
    mockCommandBus = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TargetController],
      providers: [{ provide: CommandBus, useValue: mockCommandBus }],
    }).compile();

    controller = module.get<TargetController>(TargetController);
  });

  // ── Happy path ──
  it('should dispatch UpdateTargetCommand and return result', async () => {
    const mockTarget = TargetFactory.create(
      'user-ctrl',
      500,
      new Date('2026-10-01'),
    );
    const expectedResult = {
      message: 'Target updated successfully.',
      data: mockTarget,
    };
    mockCommandBus.execute.mockResolvedValue(expectedResult);

    const dto = {
      userId: 'user-ctrl',
      scoreValue: 500,
      targetDate: new Date('2026-10-01'),
    };

    const result = await controller.updateTarget('target-id-1', dto);

    // Verify command dispatched correctly
    expect(mockCommandBus.execute).toHaveBeenCalledWith(
      expect.any(UpdateTargetCommand),
    );

    // Verify the command properties
    const dispatchedCommand = mockCommandBus.execute.mock.calls[0][0];
    expect(dispatchedCommand.targetId).toBe('target-id-1');
    expect(dispatchedCommand.userId).toBe('user-ctrl');
    expect(dispatchedCommand.scoreValue).toBe(500);

    expect(result).toEqual(expectedResult);
  });

  it('should dispatch command with null scoreValue and targetDate', async () => {
    mockCommandBus.execute.mockResolvedValue({ message: 'ok', data: {} });

    const dto = { userId: 'user-2', scoreValue: null, targetDate: null };

    await controller.updateTarget('id-2', dto);

    const cmd = mockCommandBus.execute.mock.calls[0][0];
    expect(cmd.scoreValue).toBeNull();
    expect(cmd.targetDate).toBeNull();
  });

  // ── Error handling ──
  it('should throw HttpException when command throws DomainException', async () => {
    mockCommandBus.execute.mockRejectedValue(
      new DomainException('Target not found'),
    );

    const dto = { userId: 'user-err', scoreValue: null, targetDate: null };

    await expect(controller.updateTarget('bad-id', dto)).rejects.toThrow(
      HttpException,
    );

    try {
      await controller.updateTarget('bad-id', dto);
    } catch (e) {
      expect(e.getStatus()).toBe(400);
      expect(e.getResponse().message).toBe('Target not found');
    }
  });
});
