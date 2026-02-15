import { Target } from '../../../domain/entities/target';

export abstract class TargetRepositoryPort {
  abstract save(entity: Target): Promise<Target>;
  abstract getOneByLearnerId(learnerId: string): Promise<Target | null>;
}
