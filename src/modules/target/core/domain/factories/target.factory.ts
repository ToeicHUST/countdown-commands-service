import { Score } from '@toeichust/common';
import { randomUUID } from 'crypto';
import { Target } from '../entities/target';

export class TargetFactory {
  static createNewTarget(
    learnerId: string,
    score: Score,
    targetDate: Date,
  ): Target {
    return new Target({
      id: randomUUID(),
      learnerId: learnerId,
      score: score,
      targetDate: targetDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
