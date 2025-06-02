import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let bcryptService: BcryptService;

  beforeEach(() => {
    bcryptService = new BcryptService();
  });

  it('should generate a hash different from the original password', async () => {
    const password = 'minhaSenha123';
    const hash = await bcryptService.hash(password);

    expect(hash).not.toBe(password);
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });

  it('should return true when the password matches the hash', async () => {
    const password = 'senhaSegura!';
    const hash = await bcryptService.hash(password);

    const result = await bcryptService.comparePassword(password, hash);

    expect(result).toBe(true);
  });

  it('should return false when the password does not match the hash', async () => {
    const password = 'senhaOriginal';
    const wrongPassword = 'senhaErrada';
    const hash = await bcryptService.hash(password);

    const result = await bcryptService.comparePassword(wrongPassword, hash);

    expect(result).toBe(false);
  });
});
