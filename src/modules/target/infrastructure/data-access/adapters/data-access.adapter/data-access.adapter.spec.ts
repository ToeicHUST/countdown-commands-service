import { Score } from '../../../../../../lib/value-objects/score/score';
import { Target } from '../../../../core/domain/entities/target/target';
import { TargetFactory } from '../../../../core/domain/factories/target.factory/target.factory';
import { TargetEntity } from '../../entities/target.entity/target.entity';
import { DataAccessAdapter } from './data-access.adapter';

describe('DataAccessAdapter', () => {
  // ── toDomain ──

  describe('toDomain', () => {
    it('should convert TargetEntity with score to domain Target', () => {
      const entity = new TargetEntity();
      entity.id = 'uuid-1';
      entity.userId = 'user-1';
      entity.score = 500;
      entity.targetDate = new Date('2026-06-15');
      entity.createdAt = new Date('2026-01-01');
      entity.updatedAt = new Date('2026-01-02');

      const domain = DataAccessAdapter.toDomain(entity);

      expect(domain).toBeInstanceOf(Target);
      expect(domain.id).toBe('uuid-1');
      expect(domain.userId).toBe('user-1');
      expect(domain.score).toBeInstanceOf(Score);
      expect(domain.score?.value).toBe(500);
      expect(domain.targetDate).toEqual(new Date('2026-06-15'));
    });

    it('should handle null score and targetDate', () => {
      const entity = new TargetEntity();
      entity.id = 'uuid-2';
      entity.userId = 'user-2';
      entity.score = null;
      entity.targetDate = null;
      entity.createdAt = new Date();
      entity.updatedAt = new Date();

      const domain = DataAccessAdapter.toDomain(entity);

      expect(domain.score).toBeNull();
      expect(domain.targetDate).toBeNull();
    });
  });

  // ── toPersistence ──

  describe('toPersistence', () => {
    it('should convert domain Target with score to TargetEntity', () => {
      const domain = TargetFactory.create(
        'user-x',
        new Score(450),
        new Date('2026-12-31'),
      );

      const entity = DataAccessAdapter.toPersistence(domain);

      expect(entity).toBeInstanceOf(TargetEntity);
      expect(entity.id).toBe(domain.id);
      expect(entity.userId).toBe('user-x');
      expect(entity.score).toBe(450);
      expect(entity.targetDate).toEqual(new Date('2026-12-31'));
    });

    it('should convert domain Target with null score to entity with null', () => {
      const domain = TargetFactory.create('user-y', null, null);

      const entity = DataAccessAdapter.toPersistence(domain);

      expect(entity.score).toBeNull();
      expect(entity.targetDate).toBeNull();
    });
  });

  // ── Round-trip ──
  it('should survive a round-trip: Domain → Persistence → Domain', () => {
    const original = TargetFactory.create(
      'user-rt',
      new Score(300),
      new Date('2026-03-15'),
    );

    const entity = DataAccessAdapter.toPersistence(original);
    const restored = DataAccessAdapter.toDomain(entity);

    expect(restored.id).toBe(original.id);
    expect(restored.userId).toBe(original.userId);
    expect(restored.score?.value).toBe(original.score?.value);
  });
});
