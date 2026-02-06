import { Target } from '../../entities/target/target';
import { TargetUpdatedEvent } from './target-updated.event';

describe('TargetUpdatedEvent', () => {
  it('should be defined', () => {
    const mockTarget = {} as Target;

    const event = new TargetUpdatedEvent(mockTarget);

    expect(event).toBeDefined();
    expect(event.target).toBe(mockTarget);
  });
});
