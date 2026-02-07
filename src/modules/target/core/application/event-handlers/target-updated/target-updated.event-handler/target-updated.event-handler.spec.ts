import { Test, TestingModule } from '@nestjs/testing';
import {
  PublisherEventPort,
  Score,
  TargetUpdatedEvent,
} from '@toeichust/common';
import { TargetFactory } from '../../../../domain/factories/target.factory/target.factory';
import { TargetUpdatedEventHandler } from './target-updated.event-handler';

describe('TargetUpdatedEventHandler', () => {
  let handler: TargetUpdatedEventHandler;
  let mockPublisher: { publish: jest.Mock };

  beforeEach(async () => {
    mockPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TargetUpdatedEventHandler,
        { provide: PublisherEventPort, useValue: mockPublisher },
      ],
    }).compile();

    handler = module.get<TargetUpdatedEventHandler>(TargetUpdatedEventHandler);
  });

  it('should call publisherEventPort.publish with correct payload', async () => {
    // 1. Tạo domain entity
    const target = TargetFactory.create(
      'user-abc',
      new Score(500),
      new Date('2026-08-10'),
    );

    // 2. Map dữ liệu từ domain entity sang Event (khớp với constructor trong comment)
    const event = new TargetUpdatedEvent(
      target.id,
      target.userId,
      target.score?.value ?? null,
      target.targetDate,
      target.createdAt,
      target.updatedAt,
    );

    await handler.handle(event);

    expect(mockPublisher.publish).toHaveBeenCalledTimes(1);

    // 3. Kiểm tra publish được gọi với đúng object event đã tạo
    expect(mockPublisher.publish).toHaveBeenCalledWith(event);
  });

  it('should NOT throw even if publisher fails (swallow error)', async () => {
    mockPublisher.publish.mockRejectedValue(new Error('Network error'));

    const target = TargetFactory.create('user-err', new Score(100), new Date());

    // Tương tự, map dữ liệu chính xác cho test case này
    const event = new TargetUpdatedEvent(
      target.id,
      target.userId,
      target.score?.value ?? null,
      target.targetDate,
      target.createdAt,
      target.updatedAt,
    );

    await expect(handler.handle(event)).resolves.toBeUndefined();
  });
});
