import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TargetRepositoryPort } from '../../../core/application/ports/data-access/target.repository.port';
import { Target } from '../../../core/domain/entities/target';
import { DataAccessAdapter } from '../adapters/data-access.adapter';
import { TargetEntity } from '../entities/target.entity';

@Injectable()
export class TargetOrmRepository implements TargetRepositoryPort {
  constructor(
    @InjectRepository(TargetEntity)
    private readonly repository: Repository<TargetEntity>,
  ) {}

  async save(entity: Target): Promise<Target> {
    const ormEntity = DataAccessAdapter.toPersistence(entity);
    const saved = await this.repository.save(ormEntity);
    return DataAccessAdapter.toDomain(saved);
  }

  async getOneByLearnerId(learnerId: string): Promise<Target | null> {
    const ormEntity = await this.repository.findOneBy({ learnerId });
    if (!ormEntity) return null;
    return DataAccessAdapter.toDomain(ormEntity);
  }
}
