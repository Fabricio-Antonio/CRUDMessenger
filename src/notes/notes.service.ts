import { Injectable, NotFoundException } from '@nestjs/common';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeopleService } from 'src/people/people.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    private readonly peopleService: PeopleService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Note not found');
  }

  async findAll() {
    const notes = await this.noteRepository.find({
      relations: ['to', 'from'],
      order: {
        id: 'desc',
      },
      select: {
        to: {
          id: true,
          name: true,
        },
        from: {
          id: true,
          name: true,
        },
      },
    });
    return notes;
  }

  async findOne(id: number) {
    const note = await this.noteRepository.findOne({
      where: {
        id,
      },
      relations: ['to', 'from'],
      order: {
        id: 'desc',
      },
      select: {
        to: {
          id: true,
          name: true,
        },
        from: {
          id: true,
          name: true,
        },
      },
    });
    if (note) return note;
    //throw new HttpException('Note not found.', HttpStatus.NOT_FOUND);
    this.throwNotFoundError();
  }

  async create(createNoteDto: CreateNoteDto) {
    const { toId, fromId } = createNoteDto;
    const to = await this.peopleService.findOne(toId);
    const from = await this.peopleService.findOne(fromId);

    const newNote = {
      text: createNoteDto.text,
      to,
      from,
      read: false,
      date: new Date(),
    };
    const note = await this.noteRepository.create(newNote);
    await this.noteRepository.save(note);

    return {
      ...note,
      to: {
        id: note.to.id,
      },
      from: {
        id: note.from.id,
      },
    };
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    const note = await this.findOne(id);

    note.text = updateNoteDto?.text ?? note.text;
    note.read = updateNoteDto?.read ?? note.read;

    await this.noteRepository.save(note);
    return note;
  }

  async delete(id: number) {
    const note = await this.noteRepository.findOneBy({
      id,
    });

    if (!note) return this.throwNotFoundError();
    return this.noteRepository.remove(note);
  }
}
