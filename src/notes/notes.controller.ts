import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesServices: NotesService) {}

  // Find all notes
  @Get()
  findAll() {
    return this.notesServices.findAll();
  }

  // Find one note
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesServices.findOne(id);
  }

  // Create note
  @Post()
  create(@Body() body: { name: string; content: string }) {
    return this.notesServices.create(body)
  }

  // Update note
 @Patch(':id')
update(@Param('id') id: string, @Body() body: any) {
  return this.notesServices.update(id, body);
}

  // Delete note
  @Delete(':id')
  removeNote(@Param('id') id: string) {
    return this.notesServices.delete(id);
  }
}
