import { ICommand } from '@nestjs/cqrs';

export class UpdateTargetCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly scoreValue: number,
    public readonly targetDate: Date,
  ) {}
}
