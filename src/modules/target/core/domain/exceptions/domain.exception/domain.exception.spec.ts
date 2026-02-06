import { DomainException } from './domain.exception';

describe('DomainException', () => {
  it('should be defined and hold the correct message', () => {
    const errorMessage = 'Something went wrong in the domain layer';
    const exception = new DomainException(errorMessage);

    expect(exception).toBeDefined();
    expect(exception).toBeInstanceOf(Error);
    expect(exception.message).toBe(errorMessage);
    expect(exception.name).toBe('DomainException');
  });
});
