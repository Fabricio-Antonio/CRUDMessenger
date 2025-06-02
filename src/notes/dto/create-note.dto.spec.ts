import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateNoteDto } from './create-note.dto';

describe('CreateNoteDto', () => {
  it('should validate a valid note', async () => {
    const input = { text: 'This is a valid note.', fromId: 1 };
    const dto = plainToInstance(CreateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when text is missing', async () => {
    const input = { fromId: 1 };
    const dto = plainToInstance(CreateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'text')).toBe(true);
  });

  it('should fail when text is too short', async () => {
    const input = { text: 'Hey', fromId: 1 };
    const dto = plainToInstance(CreateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'text')).toBe(true);
  });

  it('should fail when text is too long', async () => {
    const input = {
      text: 'A'.repeat(256),
      fromId: 1,
    };
    const dto = plainToInstance(CreateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'text')).toBe(true);
  });

  it('should fail when fromId is missing', async () => {
    const input = { text: 'Valid note text here.' };
    const dto = plainToInstance(CreateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'fromId')).toBe(true);
  });

  it('should fail when fromId is zero or negative', async () => {
    const inputs = [
      { text: 'Valid note', fromId: 0 },
      { text: 'Valid note', fromId: -1 },
    ];

    for (const input of inputs) {
      const dto = plainToInstance(CreateNoteDto, input);
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'fromId')).toBe(true);
    }
  });

  it('should fail when fromId is not a number', async () => {
    const input = { text: 'Valid note', fromId: 'not-a-number' };
    const dto = plainToInstance(CreateNoteDto, input);
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'fromId')).toBe(true);
  });
});
