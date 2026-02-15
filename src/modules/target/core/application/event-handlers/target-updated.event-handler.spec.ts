import { Test, TestingModule } from '@nestjs/testing';
import {
  EventPublisherPort,
  Score,
  TargetUpdatedEvent,
} from '@toeichust/common';
import { TargetFactory } from '../../domain/factories/target.factory';
import { TargetUpdatedEventHandler } from './target-updated.event-handler';

describe('TargetUpdatedEventHandler', () => {
  let handler: TargetUpdatedEventHandler;
  let mockPublisher: { publish: jest.Mock };

  beforeEach(async () => {
    mockPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TargetUpdatedEventHandler,
        { provide: EventPublisherPort, useValue: mockPublisher },
      ],
    }).compile();

    handler = module.get<TargetUpdatedEventHandler>(TargetUpdatedEventHandler);
  });

  it('should call eventPublisherPort.publish with correct payload', async () => {
    const target = TargetFactory.createNewTarget(
      'learner-id',
      new Score(500),
      new Date('2026-08-10'),
    );

    const event = new TargetUpdatedEvent(
      target.id,
      target.learnerId,
      target.score.value,
      target.targetDate,
      target.createdAt,
      target.updatedAt,
    );

    await handler.handle(event);

    expect(mockPublisher.publish).toHaveBeenCalledTimes(1);

    expect(mockPublisher.publish).toHaveBeenCalledWith(event);
  });
});
