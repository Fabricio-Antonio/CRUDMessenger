import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { UpdateNoteDto } from './update-note.dto';

describe('UpdateNoteDto', () => {
  it('should validate when read is true', async () => {
    const input = { read: true };
    const dto = plainToInstance(UpdateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.read).toBe(true);
  });

  it('should validate when read is false', async () => {
    const input = { read: false };
    const dto = plainToInstance(UpdateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.read).toBe(false);
  });

  it('should validate when read is omitted', async () => {
    const input = {};
    const dto = plainToInstance(UpdateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.read).toBeUndefined();
  });

  it('should fail validation when read is not a boolean', async () => {
    const input = { read: 'not-a-boolean' };
    const dto = plainToInstance(UpdateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('read');
  });

  it('should validate inherited fields from CreateNoteDto partially', async () => {
    const input = { text: 'Updated note text', fromId: 5, read: true };
    const dto = plainToInstance(UpdateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.text).toBe('Updated note text');
    expect(dto.fromId).toBe(5);
    expect(dto.read).toBe(true);
  });

  it('should fail validation if inherited fields are invalid', async () => {
    const input = { text: 'abc', fromId: -1, read: true }; // text too short, fromId not positive
    const dto = plainToInstance(UpdateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
