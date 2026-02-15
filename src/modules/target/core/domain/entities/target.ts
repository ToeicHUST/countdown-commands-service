import { AggregateRoot, Score } from '@toeichust/common';

export class Target extends AggregateRoot<string> {
  private _learnerId: string;
  private _score: Score;
  private _targetDate: Date;

  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    learnerId: string;
    score: Score;
    targetDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super(props.id);
    this._learnerId = props.learnerId;
    this._score = props.score;
    this._targetDate = props.targetDate;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public get learnerId(): string {
    return this._learnerId;
  }

  public get score(): Score {
    return this._score;
  }

  public get targetDate(): Date {
    return this._targetDate;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public updateTarget(score?: Score, targetDate?: Date): void {
    let hasChanged = false;

    if (score && !this._score.equals(score)) {
      this._score = score;
      hasChanged = true;
    }

    if (targetDate && this._targetDate !== targetDate) {
      this._targetDate = targetDate;
      hasChanged = true;
    }

    if (hasChanged) {
      this._updatedAt = new Date();
    }
  }
}
