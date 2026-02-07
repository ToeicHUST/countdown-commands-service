import { Test, TestingModule } from '@nestjs/testing';
import { Score } from '@toeichust/common';
import { TargetUpdatedEvent } from '../../../../domain/events/target-updated.event/target-updated.event';
import { TargetFactory } from '../../../../domain/factories/target.factory/target.factory';
import { PublisherEventPort } from '../../../ports/event-publisher/repositories/publisher-event.port/publisher-event.port';
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
    const target = TargetFactory.create(
      'user-abc',
      new Score(500),
      new Date('2026-08-10'),
    );
    const event = new TargetUpdatedEvent(target);

    await handler.handle(event);

    expect(mockPublisher.publish).toHaveBeenCalledTimes(1);

    expect(mockPublisher.publish).toHaveBeenCalledWith('target-updated', {
      eventName: 'target-updated',
      data: {
        targetId: target.id,
        userId: 'user-abc',
        score: 500,
        targetDate: target.targetDate,
        updatedAt: target.updatedAt,
      },
    });
  });

  it('should NOT throw even if publisher fails (swallow error)', async () => {
    mockPublisher.publish.mockRejectedValue(new Error('Network error'));

    const target = TargetFactory.create('user-err', new Score(100), new Date());
    const event = new TargetUpdatedEvent(target);

    await expect(handler.handle(event)).resolves.toBeUndefined();
  });
});
