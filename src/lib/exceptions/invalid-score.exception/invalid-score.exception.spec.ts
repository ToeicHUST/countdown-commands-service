import { DomainException } from '../domain.exception/domain.exception';
import { InvalidScoreException } from './invalid-score.exception';

describe('InvalidScoreException', () => {
  const value = 125;
  const min = 0;
  const max = 990;
  const step = 5;

  it('should be defined', () => {
    expect(new InvalidScoreException(value, min, max, step)).toBeDefined();
  });

  it('should inherit from DomainException', () => {
    const exception = new InvalidScoreException(value, min, max, step);
    expect(exception).toBeInstanceOf(DomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should format the error message correctly', () => {
    const exception = new InvalidScoreException(value, min, max, step);
    const expectedMessage = `Invalid Score value: ${value}. Must be between ${min}-${max} and divisible by ${step}.`;

    expect(exception.message).toBe(expectedMessage);
  });
});
