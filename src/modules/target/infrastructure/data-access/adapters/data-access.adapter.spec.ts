import { Score } from '@toeichust/common';
import { Target } from '../../../core/domain/entities/target';
import { TargetFactory } from '../../../core/domain/factories/target.factory';
import { TargetEntity } from '../entities/target.entity';
import { DataAccessAdapter } from './data-access.adapter';

describe('DataAccessAdapter', () => {
  describe('toDomain', () => {
    it('should convert TargetEntity with score to domain Target', () => {
      const entity = new TargetEntity();
      entity.id = 'uuid-1';
      entity.learnerId = 'learner-1';
      entity.score = 500;
      entity.targetDate = new Date('2026-06-15');
      entity.createdAt = new Date('2026-01-01');
      entity.updatedAt = new Date('2026-01-02');

      const domain = DataAccessAdapter.toDomain(entity);

      expect(domain).toBeInstanceOf(Target);
      expect(domain.id).toBe('uuid-1');
      expect(domain.learnerId).toBe('learner-1');
      expect(domain.score).toBeInstanceOf(Score);
      expect(domain.score.value).toBe(500);
      expect(domain.targetDate).toEqual(new Date('2026-06-15'));
    });
  });

  describe('toPersistence', () => {
    it('should convert domain Target with score to TargetEntity', () => {
      const domain = TargetFactory.createNewTarget(
        'learner-x',
        new Score(450),
        new Date('2026-12-31'),
      );

      const entity = DataAccessAdapter.toPersistence(domain);

      expect(entity).toBeInstanceOf(TargetEntity);
      expect(entity.id).toBe(domain.id);
      expect(entity.learnerId).toBe('learner-x');
      expect(entity.score).toBe(450);
      expect(entity.targetDate).toEqual(new Date('2026-12-31'));
    });
  });
});
