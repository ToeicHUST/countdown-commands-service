import { UpdateTargetCommand } from './update-target.command';

describe('UpdateTargetCommand', () => {
  it('should be defined and hold all constructor properties', () => {
    const date = new Date('2026-06-15');
    const command = new UpdateTargetCommand('learner-1', 500, date);

    expect(command).toBeDefined();
    expect(command.learnerId).toBe('learner-1');
    expect(command.scoreValue).toBe(500);
    expect(command.targetDate).toBe(date);
  });
});
