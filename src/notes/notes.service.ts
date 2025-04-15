import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

  throwNotFoundError() {
    throw new NotFoundException('Note not found');
  }
  findAll() {
    return this.notes;
  }

  findOne(id: string) {
    const note = this.notes.find(item => item.id === +id);
    if (note) return note;
    //throw new HttpException('Note not found.', HttpStatus.NOT_FOUND);
    this.throwNotFoundError();
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
    
    if (existingNoteIndex < 0) {
        this.throwNotFoundError();
    }
    
      const existingNote = this.notes[existingNoteIndex];

      this.notes[existingNoteIndex] = {
        ...existingNote,
        ...body,
      };
      return this.notes[existingNoteIndex];
  }

  delete(id: string) {
    const existingNoteIndex = this.notes.findIndex(item => item.id === +id);
    if (existingNoteIndex < 0) {
        this.throwNotFoundError();
    }
    const note = this.notes[existingNoteIndex];
      this.notes.splice(existingNoteIndex, 1);
      
      return note
  }
}