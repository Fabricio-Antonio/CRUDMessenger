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
  SetMetadata,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { NotesUtils } from './notes.utils';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { TokenPayload } from 'src/auth/params/token.payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token.payload.dto';
import { SetRoutePolicy } from '../auth/config/decorators/set-route-policy.decorator';
import { RoutePolicies } from '../auth/enum/route-policies.enum';

@UseGuards(AuthTokenGuard)
@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesServices: NotesService,
    private readonly notesUtils: NotesUtils,
  ) {}
  // Find all notes
  @Get()
  @SetRoutePolicy(RoutePolicies.findAllNotes)
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
  @UseGuards(AuthTokenGuard)
  @Post()
  create(
    @Body() createNoteDto: CreateNoteDto,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return this.notesServices.create(createNoteDto, tokenPayload);
  }

  // Update note
  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return this.notesServices.update(id, updateNoteDto, tokenPayload);
  }

  // Delete note
  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  removeNote(
    @Param('id') id: number,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return this.notesServices.delete(id, tokenPayload);
  }
}
