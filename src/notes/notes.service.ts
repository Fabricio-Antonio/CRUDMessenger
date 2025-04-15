import { Injectable } from '@nestjs/common';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  private lastId = 1;
  private notes: Note[] = [
    {
      id: 1,
      text: 'This is a note test',
      to: 'A',
      from: 'B',
      read: false,
      date: new Date(),
    },
  ];

  findAll() {
    return this.notes;
  }

  findOne(id: string) {
    return this.notes.find(item => item.id === +id);
  }

  create(body: any) {
    this.lastId++;
    const id = this.lastId;
    const newNote = {
      id,
      ...body,
    };
    this.notes.push(newNote);
    return newNote;
  }

  update(id: string, body: any) {
    const existingNoteIndex = this.notes.findIndex(item => item.id === +id);
    if (existingNoteIndex >= 0) {
      const existingNote = this.notes[existingNoteIndex];

      this.notes[existingNoteIndex] = {
        ...existingNote,
        ...body,
      };
      return this.notes[existingNoteIndex];
    }
  }

  delete(id: string) {
    const existingNoteIndex = this.notes.findIndex(item => item.id === +id);
    if (existingNoteIndex >= 0) {
      this.notes.splice(existingNoteIndex, 1);
    }
  }
}
