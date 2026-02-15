import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Score } from '@toeichust/common';
import { Repository } from 'typeorm';
import { TargetFactory } from '../../../core/domain/factories/target.factory';
import { DataAccessAdapter } from '../adapters/data-access.adapter';
import { TargetEntity } from '../entities/target.entity';
import { TargetOrmRepository } from './target.orm-repository';

describe('TargetOrmRepository', () => {
  let repo: TargetOrmRepository;
  let mockTypeOrmRepo: jest.Mocked<Repository<TargetEntity>>;

  beforeEach(async () => {
    mockTypeOrmRepo = {
      save: jest.fn(),
      findOneBy: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TargetOrmRepository,
        {
          provide: getRepositoryToken(TargetEntity),
          useValue: mockTypeOrmRepo,
        },
      ],
    }).compile();

    repo = module.get<TargetOrmRepository>(TargetOrmRepository);
  });

  describe('save', () => {
    it('should persist entity and return domain object', async () => {
      const domain = TargetFactory.createNewTarget(
        'learner-1',
        new Score(450),
        new Date('2026-06-01'),
      );
      const ormEntity = DataAccessAdapter.toPersistence(domain);

      // Mock: typeorm save trả lại entity đã save
      mockTypeOrmRepo.save.mockResolvedValue(ormEntity);

      const result = await repo.save(domain);

      expect(mockTypeOrmRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: domain.id, learnerId: 'learner-1' }),
      );
      expect(result.id).toBe(domain.id);
      expect(result.score.value).toBe(450);
    });
  });

  describe('getOneByLearnerId', () => {
    it('should return domain Target when found', async () => {
      const entity = new TargetEntity();
      entity.id = 'found-id';
      entity.learnerId = 'learner-found';
      entity.score = 300;
      entity.targetDate = new Date('2026-07-01');
      entity.createdAt = new Date();
      entity.updatedAt = new Date();

      mockTypeOrmRepo.findOneBy.mockResolvedValue(entity);

      const result = await repo.getOneByLearnerId('learner-found');

      expect(result).not.toBeNull();
      expect(result!.id).toBe('found-id');
      expect(result!.score.value).toBe(300);
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepo.findOneBy.mockResolvedValue(null);

      const result = await repo.getOneByLearnerId('missing-learner');

      expect(result).toBeNull();
    });
  });
});
