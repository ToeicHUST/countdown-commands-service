import { UpdateTargetCommand } from './update-target.command';

describe('UpdateTargetCommand', () => {
  it('should be defined and hold all constructor properties', () => {
    const date = new Date('2026-06-15');
    const command = new UpdateTargetCommand('id-1', 'user-1', 500, date);

    expect(command).toBeDefined();
    expect(command.targetId).toBe('id-1');
    expect(command.userId).toBe('user-1');
    expect(command.scoreValue).toBe(500);
    expect(command.targetDate).toBe(date);
  });

  it('should accept null for optional fields', () => {
    const command = new UpdateTargetCommand('id-2', 'user-2', null, null);

    expect(command.scoreValue).toBeNull();
    expect(command.targetDate).toBeNull();
  });
});
