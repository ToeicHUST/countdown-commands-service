import { DomainException } from '../domain.exception/domain.exception';

export class InvalidScoreException extends DomainException {
  constructor(value: number, min: number, max: number, step: number) {
    super(
      `Invalid Score value: ${value}. Must be between ${min}-${max} and divisible by ${step}.`,
    );
  }
}
