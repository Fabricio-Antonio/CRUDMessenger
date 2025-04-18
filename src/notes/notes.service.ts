import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

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

  async findAll() {
    const notes = await this.noteRepository.find()
    return notes;
  }

  async findOne(id: number) {
    const note = await this.noteRepository.findOne({
      where: {
        id,
      },
    });
    if (note) return note;
    //throw new HttpException('Note not found.', HttpStatus.NOT_FOUND);
    this.throwNotFoundError();
  }

  async create(createNoteDto: CreateNoteDto) {
    const newNote = {
      ...createNoteDto,
      read: false,
      date: new Date(),
    };
    const note = await this.noteRepository.create(newNote)
    return this.noteRepository.save(note);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    const particalUpdateNoteDto = {
      read: updateNoteDto?.read,
      text: updateNoteDto?.text,
    }
    const note = await this.noteRepository.preload({
      id,
      ...particalUpdateNoteDto,
    });

    if (!note) return this.throwNotFoundError();
    await this.noteRepository.save(note)
    return note
  }

  async delete(id: number) {
    const note = await this.noteRepository.findOneBy({
      id,
    });

    if (!note) return this.throwNotFoundError();
    return this.noteRepository.remove(note)
  }
}