import { TargetRepositoryPort } from './target.repository.port';

describe('TargetRepositoryPort', () => {
  it('should be an abstract class', () => {
    // Abstract class không thể instantiate trực tiếp
    expect(typeof TargetRepositoryPort).toBe('function');
    expect(TargetRepositoryPort.prototype.save).toBeUndefined();
    expect(TargetRepositoryPort.prototype.getOneByUserId).toBeUndefined();
  });

  it('should be implementable as a concrete class', () => {
    class MockRepository extends TargetRepositoryPort {
      async save(entity: any) {
        return entity;
      }
      async getOneByUserId(id: string) {
        return null;
      }
    }

    const repo = new MockRepository();
    expect(repo).toBeInstanceOf(TargetRepositoryPort);
  });
});
