import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('should validate a valid email and password', async () => {
    const input = {
      email: 'user@example.com',
      password: 'securepassword123',
    };
    const dto = plainToInstance(LoginDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when email is missing', async () => {
    const input = {
      password: 'securepassword123',
    };
    const dto = plainToInstance(LoginDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });

  it('should fail when password is missing', async () => {
    const input = {
      email: 'user@example.com',
    };
    const dto = plainToInstance(LoginDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });

  it('should fail when email is not a valid email', async () => {
    const input = {
      email: 'invalid-email',
      password: 'securepassword123',
    };
    const dto = plainToInstance(LoginDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });

  it('should fail when password is not a string', async () => {
    const input = {
      email: 'user@example.com',
      password: 123456, // number instead of string
    };
    const dto = plainToInstance(LoginDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });

  it('should fail when email is an empty string', async () => {
    const input = {
      email: '',
      password: 'securepassword123',
    };
    const dto = plainToInstance(LoginDto, input);
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });

  it('should fail when password is an empty string', async () => {
    const input = {
      email: 'user@example.com',
      password: '',
    };
    const dto = plainToInstance(LoginDto, input);
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });
});
