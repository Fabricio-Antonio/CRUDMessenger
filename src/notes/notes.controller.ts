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

@Controller('notes')
export class NotesController {
  // find all notes
  @Get()
  findAll(@Query() pagination: string) {
    const { limit = 10, offset = 0 } = pagination;
    return `This router return all notes limit=${limit}, Offset=${offset}`;
  }

  // Find one note
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This router return the note ID ${id}`;
  }

  @Post()
  create(@Body() body: any) {
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: string) {
    return {
      id,
      ...body,
    };
  }

  @Delete(':id')
  removeNote(@Param(':id') id: string) {
    return `Note with ID ${id} deleted`;
  }
}
