import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TargetRepositoryPort } from '../../../../core/application/ports/dataaccess/repositories/target.repository.port/target.repository.port';
import { Target } from '../../../../core/domain/entities/target/target';
import { DataaccessAdapter } from '../../adapters/dataaccess.adapter/dataaccess.adapter';
import { TargetEntity } from '../../entities/target.entity/target.entity';

@Injectable()
export class TargetOrmRepository implements TargetRepositoryPort {
  constructor(
    @InjectRepository(TargetEntity)
    private readonly repository: Repository<TargetEntity>,
  ) {}

  async save(entity: Target): Promise<Target> {
    const ormEntity = DataaccessAdapter.toPersistence(entity);
    const saved = await this.repository.save(ormEntity);
    return DataaccessAdapter.toDomain(saved);
  }

  async getOneByUserId(userId: string): Promise<Target | null> {
    const ormEntity = await this.repository.findOneBy({ userId });
    if (!ormEntity) return null;
    return DataaccessAdapter.toDomain(ormEntity);
  }
}
