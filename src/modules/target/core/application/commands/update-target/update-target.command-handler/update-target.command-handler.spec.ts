import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { DomainException } from '../../../domain/exceptions/domain.exception/domain.exception';
import { InvalidScoreException } from '../../../domain/exceptions/invalid-score.exception/invalid-score.exception';
import { TargetFactory } from '../../../domain/factories/target.factory/target.factory';
import { TargetRepositoryPort } from '../../ports/dataaccess/repositories/target.repository.port/target.repository.port';
import { UpdateTargetCommand } from '../update-target.command/update-target.command';
import { UpdateTargetCommandHandler } from './update-target.command-handler';

describe('UpdateTargetCommandHandler', () => {
  let handler: UpdateTargetCommandHandler;
  let mockRepository: jest.Mocked<TargetRepositoryPort>;
  let mockEventBus: { publish: jest.Mock };

  // Helper: tạo 1 Target sample
  const createSampleTarget = (overrides: Partial<any> = {}) => {
    return TargetFactory.create(
      overrides.userId ?? 'user-original',
      overrides.scoreValue ?? 450,
      overrides.targetDate ?? new Date('2026-06-01'),
    );
  };

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      getOneById: jest.fn(),
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

  // ────────────────────────────────────────────────────────────────
  // ✅ Happy path
  // ────────────────────────────────────────────────────────────────
  it('should update target and publish TargetUpdatedEvent', async () => {
    const existingTarget = createSampleTarget();
    mockRepository.getOneById.mockResolvedValue(existingTarget);
    mockRepository.save.mockImplementation(async (t) => t);

    const command = new UpdateTargetCommand(
      existingTarget.id,
      'user-new',
      500,
      new Date('2026-12-31'),
    );

    const result = await handler.execute(command);

    // Verify repository calls
    expect(mockRepository.getOneById).toHaveBeenCalledWith(existingTarget.id);
    expect(mockRepository.save).toHaveBeenCalledWith(existingTarget);

    // Verify domain mutation
    expect(existingTarget.userId).toBe('user-new');
    expect(existingTarget.score?.value).toBe(500);

    // Verify event published
    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ target: existingTarget }),
    );

    // Verify response
    expect(result.message).toBe('Target updated successfully.');
    expect(result.data).toBe(existingTarget);
  });

  it('should handle null scoreValue (keep existing score)', async () => {
    const existingTarget = createSampleTarget({ scoreValue: 200 });
    mockRepository.getOneById.mockResolvedValue(existingTarget);
    mockRepository.save.mockImplementation(async (t) => t);

    // scoreValue = null → không đổi score
    const command = new UpdateTargetCommand(
      existingTarget.id,
      'user-new',
      null, // null → giữ nguyên
      new Date('2027-01-01'),
    );

    await handler.execute(command);

    // Score vẫn là giá trị gốc (200) — updateTarget nhận null sẽ không chạm score
    expect(existingTarget.score?.value).toBe(200);
  });

  // ────────────────────────────────────────────────────────────────
  // ❌ Error cases
  // ────────────────────────────────────────────────────────────────
  it('should throw DomainException when target not found', async () => {
    mockRepository.getOneById.mockResolvedValue(null);

    const command = new UpdateTargetCommand(
      'non-exist-id',
      'user-1',
      100,
      null,
    );

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });

  it('should throw InvalidScoreException when score is invalid', async () => {
    const existingTarget = createSampleTarget();
    mockRepository.getOneById.mockResolvedValue(existingTarget);

    // 9999 > MAX (990) → InvalidScoreException
    const command = new UpdateTargetCommand(
      existingTarget.id,
      'user-1',
      9999,
      null,
    );

    await expect(handler.execute(command)).rejects.toThrow(
      InvalidScoreException,
    );
    expect(mockRepository.save).not.toHaveBeenCalled();
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });

  it('should throw InvalidScoreException when score is not multiple of 5', async () => {
    const existingTarget = createSampleTarget();
    mockRepository.getOneById.mockResolvedValue(existingTarget);

    const command = new UpdateTargetCommand(
      existingTarget.id,
      'user-1',
      123,
      null,
    );

    await expect(handler.execute(command)).rejects.toThrow(
      InvalidScoreException,
    );
  });
});
