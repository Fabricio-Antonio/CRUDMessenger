import { Controller, Get, Param } from '@nestjs/common';

@Controller('notes')
export class NotesController {
    // find all notes
    @Get()
    findAll() {
        return 'This router return all notes'
    }

    // Find one note
    @Get(':id')
    findOne(@Param('id') id: string) {
        return `This router return the note ID ${id}`
        }
}
