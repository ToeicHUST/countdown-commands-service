import { Score } from '../../value-objects/score/score';

export class Target {
  readonly id: string;

  userId: string;
  score: Score | null;
  targetDate: Date | null;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    score: Score | null;
    targetDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.userId = props.userId;
    this.score = props.score;
    this.targetDate = props.targetDate;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  updateTarget(
    userId?: string,
    score?: Score | null,
    targetDate?: Date | null,
  ) {
    let hasChanged = false;

    if (userId !== undefined && this.userId !== userId) {
      this.userId = userId;
      hasChanged = true;
    }

    if (score !== undefined && this.score !== score) {
      this.score = score;
      hasChanged = true;
    }

    if (targetDate !== undefined && this.targetDate !== targetDate) {
      this.targetDate = targetDate;
      hasChanged = true;
    }

    if (hasChanged) {
      this.updatedAt = new Date();
    }
  }
}
