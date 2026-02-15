import { TargetRepositoryPort } from './target.repository.port';

describe('TargetRepositoryPort', () => {
  it('should be an abstract class', () => {
    expect(typeof TargetRepositoryPort).toBe('function');
    expect(TargetRepositoryPort.prototype.save).toBeUndefined();
    expect(TargetRepositoryPort.prototype.getOneByLearnerId).toBeUndefined();
  });

  it('should be implementable as a concrete class', () => {
    class MockRepository extends TargetRepositoryPort {
      async save(entity: any) {
        return entity;
      }
      async getOneByLearnerId(id: string) {
        return null;
      }
    }

    const repo = new MockRepository();
    expect(repo).toBeInstanceOf(TargetRepositoryPort);
  });
});
