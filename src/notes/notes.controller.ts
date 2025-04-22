import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
  UsePipes,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesServices: NotesService) {}

  // Find all notes
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
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
