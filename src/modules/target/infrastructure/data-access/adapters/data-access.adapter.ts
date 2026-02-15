import { Score } from '@toeichust/common';
import { Target } from '../../../core/domain/entities/target';
import { TargetEntity } from '../entities/target.entity';

export class DataAccessAdapter {
  static toDomain(entity: TargetEntity): Target {
    return new Target({
      id: entity.id,
      learnerId: entity.learnerId,
      score: new Score(entity.score),
      targetDate: new Date(entity.targetDate),
      createdAt: new Date(entity.createdAt),
      updatedAt: new Date(entity.updatedAt),
    });
  }

  static toPersistence(domain: Target): TargetEntity {
    const entity = new TargetEntity();

    entity.id = domain.id;
    entity.learnerId = domain.learnerId;

    entity.score = domain.score.value;

    entity.targetDate = domain.targetDate;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    return entity;
  }
}
