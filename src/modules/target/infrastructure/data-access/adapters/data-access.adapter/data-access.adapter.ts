import { Score } from '@toeichust/common';
import { Target } from '../../../../core/domain/entities/target/target';
import { TargetEntity } from '../../entities/target.entity/target.entity'; // (path adjust)

/**
 * Adapter chuyển đổi giữa Domain Entity ↔ Persistence (ORM) Entity.
 * Giữ domain layer hoàn toàn không phụ thuộc typeorm.
 */
export class DataAccessAdapter {
  /** ORM Entity → Domain Entity (dùng khi đọc từ DB) */
  static toDomain(entity: TargetEntity): Target {
    return new Target({
      id: entity.id,
      userId: entity.userId,
      score: entity.score !== null ? new Score(entity.score) : null,
      targetDate: entity.targetDate ? new Date(entity.targetDate) : null,
      createdAt: new Date(entity.createdAt),
      updatedAt: new Date(entity.updatedAt),
    });
  }

  /** Domain Entity → ORM Entity (dùng khi ghi vào DB) */
  static toPersistence(domain: Target): TargetEntity {
    const entity = new TargetEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.score = domain.score?.value ?? null;
    entity.targetDate = domain.targetDate;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
