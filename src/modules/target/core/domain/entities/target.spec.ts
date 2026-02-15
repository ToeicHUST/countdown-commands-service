import { Score } from '@toeichust/common';
import { TargetFactory } from '../factories/target.factory';

describe('Target', () => {
  it('should initialize successfully via Factory', () => {
    const learnerId = 'learner-123';
    const scoreVal = 450;
    const targetDate = new Date('2026-02-02');

    const target = TargetFactory.createNewTarget(
      learnerId,
      new Score(scoreVal),
      targetDate,
    );

    expect(target).toBeDefined();
    expect(target.id).toBeDefined();
    expect(target.learnerId).toBeDefined();
    expect(target.score.value).toBeDefined();
    expect(target.targetDate).toBeDefined();
    expect(target.createdAt).toBeDefined();
    expect(target.updatedAt).toBeDefined();

    expect(target.learnerId).toBe(learnerId);
    expect(target.score.value).toBe(scoreVal);
    expect(target.targetDate).toBe(targetDate);
  });

  it('should update data and updatedAt timestamp correctly', () => {
    const target = TargetFactory.createNewTarget(
      'learner-123',
      new Score(100),
      new Date('2025-01-01'),
    );

    const oldUpdatedAt = target.updatedAt;

    return new Promise((resolve) => setTimeout(resolve, 10)).then(() => {
      const newScore = new Score(500);
      const newTargetDate = new Date('2026-03-03');

      target.updateTarget(newScore, newTargetDate);

      expect(target).toBeDefined();
      expect(target.id).toBeDefined();
      expect(target.learnerId).toBeDefined();
      expect(target.score.value).toBeDefined();
      expect(target.targetDate).toBeDefined();
      expect(target.createdAt).toBeDefined();
      expect(target.updatedAt).toBeDefined();

      expect(target.score.value).toBe(newScore.value);
      expect(target.targetDate).toBe(newTargetDate);
      expect(target.updatedAt.getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );
    });
  });
});
