import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesServices: NotesService) {}

  // Find all notes
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    
    const notes = await this.notesServices.findAll();
    return notes;
  }

  // Find one note
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesServices.findOne(+id);
  }

  // Create note
  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesServices.create(createNoteDto);
  }

  // Update note
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesServices.update(+id, updateNoteDto);
  }

  // Delete note
  @Delete(':id')
  removeNote(@Param('id') id: string) {
    return this.notesServices.delete(+id);
  }
}
