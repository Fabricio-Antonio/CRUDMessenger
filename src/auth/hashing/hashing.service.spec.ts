import { HashingServiceProtocol } from './hashing.service';

class DummyHashingService extends HashingServiceProtocol {
  hash(password: string): Promise<string> {
    return Promise.resolve(`hashed-${password}`);
  }

  comparePassword(password: string, passwordHash: string): Promise<boolean> {
    return Promise.resolve(passwordHash === `hashed-${password}`);
  }
}

describe('HashingServiceProtocol implementation', () => {
  let service: HashingServiceProtocol;

  beforeEach(() => {
    service = new DummyHashingService();
  });

  it('should hash a password in the expected format', async () => {
    const password = 'test123';
    const hash = await service.hash(password);
    expect(hash).toBe('hashed-test123');
  });

  it('should return true when password matches the hash', async () => {
    const password = 'myPassword';
    const hash = await service.hash(password);
    const result = await service.comparePassword(password, hash);
    expect(result).toBe(true);
  });

  it('should return false when password does not match the hash', async () => {
    const password = 'correctPassword';
    const wrongPassword = 'wrongPassword';
    const hash = await service.hash(password);
    const result = await service.comparePassword(wrongPassword, hash);
    expect(result).toBe(false);
  });
});
