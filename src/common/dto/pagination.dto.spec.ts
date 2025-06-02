import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

describe('PaginationDto', () => {
  it('should validate a valid DTO', async () => {
    const input = { limit: 20, offset: 10 };
    const dto = plainToInstance(PaginationDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when limit is negative', async () => {
    const input = { limit: -1, offset: 5 };
    const dto = plainToInstance(PaginationDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('limit');
  });

  it('should fail when limit is greater than 50', async () => {
    const input = { limit: 100 };
    const dto = plainToInstance(PaginationDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('limit');
  });

  it('should fail when offset is negative', async () => {
    const input = { offset: -5 };
    const dto = plainToInstance(PaginationDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('offset');
  });

  it('should allow missing limit and offset (optional)', async () => {
    const input = {};
    const dto = plainToInstance(PaginationDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when limit is not an integer', async () => {
    const input = { limit: 'not-a-number' };
    const dto = plainToInstance(PaginationDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('limit');
  });

  it('should fail when offset is not an integer', async () => {
    const input = { offset: 'offset' };
    const dto = plainToInstance(PaginationDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('offset');
  });
});
