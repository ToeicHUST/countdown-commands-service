import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { BaseResponseDto, Score } from '@toeichust/common';
import { UpdateTargetCommand } from '../../../core/application/commands/update-target.command';
import { UpdateTargetController } from './update-target.controller';

describe('UpdateTargetController', () => {
  let controller: UpdateTargetController;
  let commandBus: CommandBus;

  const mockExecute = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateTargetController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: mockExecute },
        },
      ],
    }).compile();

    controller = module.get<UpdateTargetController>(UpdateTargetController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateTarget', () => {
    const learnerId = 'learner-123';
    const dto = {
      scoreValue: 850,
      targetDate: new Date('2026-12-31'),
    };

    const expectedResult = {
      data: {
        id: 'target-id-1',
        learnerId: learnerId,
        score: new Score(dto.scoreValue),
        targetDate: dto.targetDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    it('should map DTO to Command and return result correctly', async () => {
      mockExecute.mockResolvedValue(expectedResult);

      const result = await controller.updateTarget(learnerId, dto);

      expect(mockExecute).toHaveBeenCalledWith(
        new UpdateTargetCommand(learnerId, dto.scoreValue, dto.targetDate),
      );

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(BaseResponseDto);
      expect(result.message).toBeDefined();
      expect(result.data).toBeDefined();

      expect(result.message).toBe('Target updated successfully');

      expect(result.data.id).toBe('target-id-1');
      expect(result.data.learnerId).toBe(learnerId);
      expect(result.data.score).toBe(850);
      expect(result.data.targetDate).toEqual(dto.targetDate);
      expect(result.data.createdAt).toBeDefined();
      expect(result.data.updatedAt).toBeDefined();
    });
  });
});
