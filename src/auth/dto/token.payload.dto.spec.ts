import 'reflect-metadata';
import { TokenPayloadDto } from './token.payload.dto';

describe('TokenPayloadDto', () => {
  it('should create an instance with all properties correctly assigned', () => {
    const payload = new TokenPayloadDto();

    payload.sub = '12345';
    payload.email = 'user@example.com';
    payload.iat = 1680000000;
    payload.exp = 1680003600;
    payload.aud = 'my-audience';
    payload.iss = 'my-issuer';

    expect(payload.sub).toBe('12345');
    expect(payload.email).toBe('user@example.com');
    expect(typeof payload.iat).toBe('number');
    expect(typeof payload.exp).toBe('number');
    expect(payload.aud).toBe('my-audience');
    expect(payload.iss).toBe('my-issuer');
  });

  it('should have numeric issued at and expiration times', () => {
    const payload = new TokenPayloadDto();
    payload.iat = Date.now();
    payload.exp = Date.now() + 3600 * 1000;

    expect(typeof payload.iat).toBe('number');
    expect(typeof payload.exp).toBe('number');
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });
});
