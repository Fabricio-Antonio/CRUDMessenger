import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
  Inject,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { NotesUtils } from './notes.utils';
import { RegexProtocol } from 'src/common/regex/regex.protocol';
import {
  ONLY_LOWERCASE_LETTERS,
  REMOVE_SPACES,
  SERVER_NAME,
} from 'src/notes/notes.constants';

@Controller('notes')
export class NotesController {
  constructor(
    @Inject(SERVER_NAME)
    private readonly serverName: string,
    private readonly notesServices: NotesService,
    private readonly notesUtils: NotesUtils,
    @Inject(REMOVE_SPACES)
    private readonly removeSpacesRegex: RegexProtocol,
    @Inject(ONLY_LOWERCASE_LETTERS)
    private readonly onlyLowercaseLattersRagex: RegexProtocol,
  ) {}

  // Find all notes
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    console.log(this.removeSpacesRegex.execute(this.serverName));
    console.log(this.onlyLowercaseLattersRagex.execute(this.serverName));
    console.log(this.serverName);
    return this.notesServices.findAll(paginationDto);

    const notes = await this.notesServices.findAll();
    return notes;
  }

  // Find one note
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notesServices.findOne(id);
  }

  // Create note
  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesServices.create(createNoteDto);
  }

  // Update note
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesServices.update(id, updateNoteDto);
  }

  // Delete note
  @Delete(':id')
  removeNote(@Param('id') id: number) {
    return this.notesServices.delete(id);
  }
}
