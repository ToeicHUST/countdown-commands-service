import { Score } from '@toeichust/common';
import { Target } from '../entities/target';
import { TargetFactory } from './target.factory';

describe('TargetFactory', () => {
  describe('create', () => {
    it('should create a new Target with generated ID and timestamps', () => {
      const learnerId = 'learner-123';
      const scoreValue = 450;
      const targetDate = new Date('2026-12-31');

      const target = TargetFactory.createNewTarget(
        learnerId,
        new Score(scoreValue),
        targetDate,
      );

      expect(target).toBeDefined();
      expect(target.id).toBeDefined();
      expect(target.learnerId).toBeDefined();
      expect(target.score.value).toBeDefined();
      expect(target.targetDate).toBeDefined();
      expect(target.createdAt).toBeDefined();
      expect(target.updatedAt).toBeDefined();

      expect(target).toBeInstanceOf(Target);
      expect(target.learnerId).toBe(learnerId);
      expect(target.score.value).toBe(scoreValue);
      expect(target.targetDate).toBe(targetDate);
    });
  });
});
