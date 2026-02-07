import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTargetCommand } from '../../../core/application/commands/update-target/update-target.command/update-target.command';
import { TargetController } from './target.controller';

describe('TargetController', () => {
  let controller: TargetController;
  let commandBus: CommandBus;

  const mockExecute = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TargetController],
      providers: [
        {
          provide: CommandBus,

          useValue: { execute: mockExecute },
        },
      ],
    }).compile();

    controller = module.get<TargetController>(TargetController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateTarget', () => {
    const userId = 'user-123';
    const dto = {
      scoreValue: 850,
      targetDate: new Date('2026-12-31'),
    };

    it('should map DTO to Command and return result correctly', async () => {
      const expectedResult = { id: 'target-1', ...dto };
      mockExecute.mockResolvedValue(expectedResult);

      const result = await controller.updateTarget(userId, dto);

      expect(mockExecute).toHaveBeenCalledWith(
        new UpdateTargetCommand(userId, dto.scoreValue, dto.targetDate),
      );

      expect(result).toEqual(expectedResult);
    });

    it('should wrap errors into HttpException', async () => {
      const errorMsg = 'Invalid target date';
      mockExecute.mockRejectedValue(new Error(errorMsg));

      try {
        await controller.updateTarget(userId, dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(error.getResponse()).toEqual({ message: errorMsg });
      }
    });
  });
});
