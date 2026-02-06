import { Test, TestingModule } from '@nestjs/testing';
import { TargetUpdatedEvent } from '../../../domain/events/target-updated.event/target-updated.event';
import { TargetFactory } from '../../../domain/factories/target.factory/target.factory';
import { PublisherEventPort } from '../../ports/event-publisher/repositories/publisher-event.port/publisher-event.port';
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
      500,
      new Date('2026-08-10'),
    );
    const event = new TargetUpdatedEvent(target);

    await handler.handle(event);

    expect(mockPublisher.publish).toHaveBeenCalledTimes(1);
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      'target-updated',
      expect.objectContaining({
        eventName: 'target-updated',
        targetId: target.id,
        userId: 'user-abc',
        score: 500,
      }),
    );
  });

  it('should NOT throw even if publisher fails (swallow error)', async () => {
    mockPublisher.publish.mockRejectedValue(new Error('Network error'));

    const target = TargetFactory.create('user-err', 100, null);
    const event = new TargetUpdatedEvent(target);

    // Không throw → test pass
    await expect(handler.handle(event)).resolves.toBeUndefined();
  });

  it('should handle target with null score gracefully', async () => {
    const target = TargetFactory.create('user-null', null, null);
    const event = new TargetUpdatedEvent(target);

    await handler.handle(event);

    expect(mockPublisher.publish).toHaveBeenCalledWith(
      'target-updated',
      expect.objectContaining({ score: null }),
    );
  });
});
