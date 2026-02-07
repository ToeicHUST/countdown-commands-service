import { Target } from '../../../../../domain/entities/target/target';

export abstract class TargetRepositoryPort {
  abstract save(entity: Target): Promise<Target>;
  abstract getOneByUserId(userId: string): Promise<Target | null>;
}
