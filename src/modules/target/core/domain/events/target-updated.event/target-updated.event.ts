import { Target } from '../../entities/target/target';

export class TargetUpdatedEvent {
  constructor(public readonly target: Target) {}
}
