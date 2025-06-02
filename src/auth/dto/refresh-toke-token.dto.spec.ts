import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RefreshTokenDto } from './refresh-toke-token.dto';

describe('RefreshTokenDto', () => {
  it('should validate a valid refreshToken', async () => {
    const input = { refreshToken: 'valid-refresh-token-123' };
    const dto = plainToInstance(RefreshTokenDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when refreshToken is missing', async () => {
    const input = {};
    const dto = plainToInstance(RefreshTokenDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('refreshToken');
  });

  it('should fail when refreshToken is an empty string', async () => {
    const input = { refreshToken: '' };
    const dto = plainToInstance(RefreshTokenDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('refreshToken');
  });

  it('should fail when refreshToken is not a string', async () => {
    const input = { refreshToken: 12345 }; // wrong type
    const dto = plainToInstance(RefreshTokenDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('refreshToken');
  });
});
