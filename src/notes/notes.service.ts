import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeopleService } from 'src/people/people.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { NotesUtils } from './notes.utils';
import { TokenPayloadDto } from 'src/auth/dto/token.payload.dto';
import { EmailService } from 'src/email/email.service';
import { ResponseNoteDto } from './dto/response-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    private readonly peopleService: PeopleService,
    private readonly notesUtils: NotesUtils,
    private readonly emailService: EmailService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Note not found');
  }

  async findAll(paginationDto?: PaginationDto): Promise<ResponseNoteDto[]> {
    //console.log(this.notesUtils.invertStrintg('Hello World'));
    const { limit = 10, offset = 0 } = paginationDto;

    const notes = await this.noteRepository.find({
      take: limit,
      skip: offset,
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

  async findOne(id: number): Promise<ResponseNoteDto> {
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
    this.throwNotFoundError();
  }

  async create(
    createNoteDto: CreateNoteDto,
    tokenPayload: TokenPayloadDto,
  ): Promise<ResponseNoteDto> {
    const { fromId } = createNoteDto;
    const to = await this.peopleService.findOne(Number(tokenPayload.sub));
    const from = await this.peopleService.findOne(fromId);

    const newNote = {
      text: createNoteDto.text,
      to,
      from,
      read: false,
      date: new Date(),
    };
    const note = this.noteRepository.create(newNote);
    await this.noteRepository.save(note);

    await this.emailService.sendEmail(
      from.email,
      `You recived a note from "${from.name}" <${to.email}>`,
      createNoteDto.text,
    );

    return {
      ...note,
      to: {
        id: note.to.id,
        name: note.to.name,
      },
      from: {
        id: note.from.id,
        name: note.from.name,
      },
    };
  }

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
    tokenPayload: TokenPayloadDto,
  ): Promise<ResponseNoteDto> {
    const note = await this.findOne(id);

    if (note.from.id != Number(tokenPayload.sub)) {
      throw new ForbiddenException('You are not allowed to update this note');
    }

    note.text = updateNoteDto?.text ?? note.text;
    note.read = updateNoteDto?.read ?? note.read;

    await this.noteRepository.save(note);
    return note;
  }

  async delete(
    id: number,
    tokenPayload: TokenPayloadDto,
  ): Promise<ResponseNoteDto> {
    const note = await this.findOne(id);

    if (note.from.id != Number(tokenPayload.sub)) {
      throw new ForbiddenException('You are not allowed to update this note');
    }

    await this.noteRepository.delete(note.id);
    return note;
  }
}
