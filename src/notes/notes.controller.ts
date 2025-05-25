import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { NotesUtils } from './notes.utils';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { TokenPayload } from 'src/auth/params/token.payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token.payload.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesServices: NotesService,
    private readonly notesUtils: NotesUtils,
  ) {}

  // Find all notes
  @Get()
  @ApiOperation({ summary: 'List all notes with pagination' })
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 1,
    description: 'Page number to start from',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of notes retrieved successfully',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const notes = await this.notesServices.findAll(paginationDto);
    return notes;
  }

  // Find one note
  @Get(':id')
  @ApiOperation({ summary: 'Get a single note by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  findOne(@Param('id') id: number) {
    return this.notesServices.findOne(id);
  }

  // Create note
  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  create(
    @Body() createNoteDto: CreateNoteDto,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return this.notesServices.create(createNoteDto, tokenPayload);
  }

  // Update note
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing note' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Note ID' })
  @ApiBody({ type: UpdateNoteDto })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  update(
    @Param('id') id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return this.notesServices.update(id, updateNoteDto, tokenPayload);
  }

  // Delete note
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  removeNote(
    @Param('id') id: number,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return this.notesServices.delete(id, tokenPayload);
  }
}
