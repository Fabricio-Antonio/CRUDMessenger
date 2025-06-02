import 'reflect-metadata';
import { ResponseNoteDto } from './response-note.dto';

describe('ResponseNoteDto', () => {
  it('should create an instance with all properties correctly assigned', () => {
    const now = new Date();
    const dto = new ResponseNoteDto();

    dto.id = 1;
    dto.text = 'Note content';
    dto.read = false;
    dto.date = now;
    dto.createdAt = now;
    dto.updatedAt = now;
    dto.to = { id: 2, name: 'Alice' };
    dto.from = { id: 3, name: 'Bob' };

    expect(dto.id).toBe(1);
    expect(dto.text).toBe('Note content');
    expect(dto.read).toBe(false);
    expect(dto.date).toBeInstanceOf(Date);
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(dto.updatedAt).toBeInstanceOf(Date);
    expect(dto.to).toEqual({ id: 2, name: 'Alice' });
    expect(dto.from).toEqual({ id: 3, name: 'Bob' });
  });

  it('should allow optional createdAt and updatedAt to be undefined', () => {
    const dto = new ResponseNoteDto();

    dto.id = 1;
    dto.text = 'Note content';
    dto.read = true;
    dto.date = new Date();
    dto.to = { id: 2, name: 'Alice' };
    dto.from = { id: 3, name: 'Bob' };

    expect(dto.createdAt).toBeUndefined();
    expect(dto.updatedAt).toBeUndefined();
  });
});
