import { randomUUID } from 'crypto';
import { Score } from '../../../../../../lib/value-objects/score/score';
import { Target } from '../../entities/target/target';

export class TargetFactory {
  static create(
    userId: string,
    score: Score | null,
    targetDate: Date | null,
  ): Target {
    return new Target({
      id: randomUUID(),
      userId: userId,
      score: score,
      targetDate: targetDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
