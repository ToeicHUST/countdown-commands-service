import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Score } from '@toeichust/common';
import { TargetFactory } from '../../domain/factories/target.factory';
import { TargetRepositoryPort } from '../ports/data-access/target.repository.port';
import { UpdateTargetCommand } from './update-target.command';
import { UpdateTargetCommandHandler } from './update-target.command-handler';

describe('UpdateTargetCommandHandler', () => {
  let handler: UpdateTargetCommandHandler;
  let mockRepository: jest.Mocked<TargetRepositoryPort>;
  let mockEventBus: { publish: jest.Mock };

  const createSampleTarget = (overrides: Partial<any> = {}) => {
    return TargetFactory.createNewTarget(
      overrides.learnerId ?? 'learner-original',
      new Score(overrides.scoreValue ?? 450),
      overrides.targetDate ?? new Date('2026-06-01'),
    );
  };

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      getOneByLearnerId: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockEventBus = { publish: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTargetCommandHandler,
        { provide: TargetRepositoryPort, useValue: mockRepository },
        { provide: EventBus, useValue: mockEventBus },
      ],
    }).compile();

    handler = module.get<UpdateTargetCommandHandler>(
      UpdateTargetCommandHandler,
    );
  });

  it('should update target and publish TargetUpdatedEvent', async () => {
    const existingTarget = createSampleTarget();
    mockRepository.getOneByLearnerId.mockResolvedValue(existingTarget);
    mockRepository.save.mockImplementation(async (t) => t);

    const scoreVal = 450;
    const targetDate = new Date('2026-02-02');

    const command = new UpdateTargetCommand(
      existingTarget.learnerId,
      scoreVal,
      targetDate,
    );

    const result = await handler.execute(command);

    expect(mockRepository.getOneByLearnerId).toHaveBeenCalledWith(
      existingTarget.learnerId,
    );
    expect(mockRepository.save).toHaveBeenCalledWith(existingTarget);

    expect(existingTarget.learnerId).toBe('learner-original');
    expect(existingTarget.score.value).toBe(scoreVal);
    expect(existingTarget.targetDate).toBe(targetDate);

    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        topic: 'target-updated',
        data: expect.objectContaining({
          learnerId: existingTarget.learnerId,
          targetId: existingTarget.id,
          score: scoreVal,
          targetDate: targetDate,
        }),
      }),
    );

    expect(result.message).toBe('Target updated successfully.');
    expect(result.data).toBe(existingTarget);
  });

  it('should create new target when target not found (Upsert logic)', async () => {
    mockRepository.getOneByLearnerId.mockResolvedValue(null);
    mockRepository.save.mockImplementation(async (t) => t);

    const command = new UpdateTargetCommand(
      'new-learner-id',
      100,
      new Date('2026-12-31'),
    );

    const result = await handler.execute(command);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalled();
    expect(result.message).toBe('Target updated successfully.');
  });

  // it('should throw InvalidScoreException when score is invalid', async () => {
  //   const existingTarget = createSampleTarget();
  //   mockRepository.getOneByLearnerId.mockResolvedValue(existingTarget);

  //   // 9999 > MAX (990) → InvalidScoreException
  //   const command = new UpdateTargetCommand(
  //     existingTarget.learnerId,
  //     9999,
  //     new Date('2026-12-31'),
  //   );

  //   await expect(handler.execute(command)).rejects.toThrow(
  //     InvalidScoreException,
  //   );
  //   expect(mockRepository.save).not.toHaveBeenCalled();
  //   expect(mockEventBus.publish).not.toHaveBeenCalled();
  // });

  // it('should throw InvalidScoreException when score is not multiple of 5', async () => {
  //   const existingTarget = createSampleTarget();
  //   mockRepository.getOneByLearnerId.mockResolvedValue(existingTarget);

  //   const command = new UpdateTargetCommand(
  //     existingTarget.learnerId,
  //     123,
  //     new Date('2026-12-31'),
  //   );

  //   await expect(handler.execute(command)).rejects.toThrow(
  //     InvalidScoreException,
  //   );
  // });
});
