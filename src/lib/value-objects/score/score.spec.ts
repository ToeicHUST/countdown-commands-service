import { InvalidScoreException } from '../../exceptions/invalid-score.exception/invalid-score.exception';
import { Score } from './score';

describe('Score', () => {
  it('should create an instance with a valid score (e.g., 450)', () => {
    const score = new Score(450);
    expect(score.value).toBe(450);
  });

  it('should throw InvalidScoreException if the score is not a multiple of 5', () => {
    expect(() => new Score(452)).toThrow(InvalidScoreException);
  });

  it('should throw InvalidScoreException if the score is out of range', () => {
    expect(() => new Score(5)).toThrow(InvalidScoreException);
    expect(() => new Score(1000)).toThrow(InvalidScoreException);
  });
});
