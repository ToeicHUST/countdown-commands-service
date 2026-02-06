import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TargetFactory } from '../../../core/domain/factories/target.factory/target.factory';
import { DataaccessAdapter } from '../../adapters/dataaccess.adapter/dataaccess.adapter';
import { TargetEntity } from '../../entities/target.entity/target.entity';
import { TargetOrmRepository } from './target.orm-repository';

describe('TargetOrmRepository', () => {
  let repo: TargetOrmRepository;
  let mockTypeOrmRepo: jest.Mocked<Repository<TargetEntity>>;

  beforeEach(async () => {
    mockTypeOrmRepo = {
      save: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
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

  // ── save ──

  describe('save', () => {
    it('should persist entity and return domain object', async () => {
      const domain = TargetFactory.create(
        'user-1',
        450,
        new Date('2026-06-01'),
      );
      const ormEntity = DataaccessAdapter.toPersistence(domain);

      // Mock: typeorm save trả lại entity đã save
      mockTypeOrmRepo.save.mockResolvedValue(ormEntity);

      const result = await repo.save(domain);

      expect(mockTypeOrmRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: domain.id, userId: 'user-1' }),
      );
      expect(result.id).toBe(domain.id);
      expect(result.score?.value).toBe(450);
    });
  });

  // ── getOneById ──

  describe('getOneById', () => {
    it('should return domain Target when found', async () => {
      const entity = new TargetEntity();
      entity.id = 'found-id';
      entity.userId = 'user-found';
      entity.score = 300;
      entity.targetDate = new Date('2026-07-01');
      entity.createdAt = new Date();
      entity.updatedAt = new Date();

      mockTypeOrmRepo.findOneBy.mockResolvedValue(entity);

      const result = await repo.getOneByUserId('found-id');

      expect(result).not.toBeNull();
      expect(result!.id).toBe('found-id');
      expect(result!.score?.value).toBe(300);
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepo.findOneBy.mockResolvedValue(null);

      const result = await repo.getOneByUserId('missing-id');

      expect(result).toBeNull();
    });
  });

  // ── delete ──

  describe('delete', () => {
    it('should return true when deletion is successful', async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const domain = TargetFactory.create('user-del', 200, null);
      const result = await repo.delete(domain);

      expect(result).toBe(true);
      expect(mockTypeOrmRepo.delete).toHaveBeenCalledWith(domain.id);
    });

    it('should return false when nothing was deleted', async () => {
      mockTypeOrmRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const domain = TargetFactory.create('user-nodel', 200, null);
      const result = await repo.delete(domain);

      expect(result).toBe(false);
    });
  });
});
