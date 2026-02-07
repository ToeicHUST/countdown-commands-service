import { TargetEntity } from './target.entity';

describe('TargetEntity', () => {
  it('should be defined and instantiable', () => {
    const entity = new TargetEntity();
    expect(entity).toBeDefined();
  });

  it('should accept all mapped properties', () => {
    const entity = new TargetEntity();
    entity.id = 'uuid-123';
    entity.userId = 'user-456';
    entity.score = 450;
    entity.targetDate = new Date('2026-12-31');
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    expect(entity.id).toBe('uuid-123');
    expect(entity.userId).toBe('user-456');
    expect(entity.score).toBe(450);
    expect(entity.targetDate).toEqual(new Date('2026-12-31'));
  });

  it('should allow score and targetDate to be null', () => {
    const entity = new TargetEntity();
    entity.score = null;
    entity.targetDate = null;

    expect(entity.score).toBeNull();
    expect(entity.targetDate).toBeNull();
  });
});
