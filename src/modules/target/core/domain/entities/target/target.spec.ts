import { Score } from '../../../../../../lib/value-objects/score/score';
import { TargetFactory } from '../../factories/target.factory/target.factory';

describe('Target Entity', () => {
  it('should initialize successfully via Factory', () => {
    const userId = 'user-123';
    const scoreVal = 450;
    const targetDate = new Date('2026-02-02');

    const target = TargetFactory.create(
      userId,
      new Score(scoreVal),
      targetDate,
    );

    expect(target).toBeDefined();
    expect(target.id).toBeDefined();
    expect(target.userId).toBe(userId);
    expect(target.score?.value).toBe(scoreVal);
  });

  it('should update data and updatedAt timestamp correctly', () => {
    const target = TargetFactory.create(
      'user-old',
      new Score(100),
      new Date('2025-01-01'),
    );

    const oldUpdatedAt = target.updatedAt;

    return new Promise((resolve) => setTimeout(resolve, 10)).then(() => {
      const newScore = new Score(500);
      const newTargetDate = new Date('2026-03-03');

      target.updateTarget('user-new', newScore, newTargetDate);

      expect(target.userId).toBe('user-new');
      expect(target.score).toEqual(newScore);

      expect(target.updatedAt.getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );
    });
  });
});
