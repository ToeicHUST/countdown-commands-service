import { InvalidScoreException } from '../../exceptions/invalid-score.exception/invalid-score.exception';

export class Score {
  private static readonly MIN_VALUE = 10;
  private static readonly MAX_VALUE = 990;
  private static readonly STEP = 5;

  value: number;

  constructor(value: number) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const isOutOfRange =
      this.value < Score.MIN_VALUE || this.value > Score.MAX_VALUE;

    const isNotDivisibleByStep = this.value % Score.STEP !== 0;

    if (isOutOfRange || isNotDivisibleByStep) {
      throw new InvalidScoreException(
        this.value,
        Score.MIN_VALUE,
        Score.MAX_VALUE,
        Score.STEP,
      );
    }
  }

  equals(score: Score): boolean {
    return this.value === score.value;
  }

  toJSON() {
    return this.value;
  }
}
