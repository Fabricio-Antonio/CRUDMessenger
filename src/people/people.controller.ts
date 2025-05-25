import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { TokenPayload } from 'src/auth/params/token.payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token.payload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('People')
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new person' })
  @ApiBody({ type: CreatePersonDto })
  @ApiResponse({ status: 201, description: 'Person created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Retrieve all people' })
  @ApiResponse({ status: 200, description: 'List of people returned successfully' })
  findAll() {
    return this.peopleService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a person by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Person ID' })
  @ApiResponse({ status: 200, description: 'Person found successfully' })
  @ApiResponse({ status: 404, description: 'Person not found' })
  findOne(@Param('id') id: string) {
    return this.peopleService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a person by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Person ID' })
  @ApiBody({ type: UpdatePersonDto })
  @ApiResponse({ status: 200, description: 'Person updated successfully' })
  @ApiResponse({ status: 404, description: 'Person not found' })
  update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return this.peopleService.update(+id, updatePersonDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a person by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Person ID' })
  @ApiResponse({ status: 200, description: 'Person deleted successfully' })
  @ApiResponse({ status: 404, description: 'Person not found' })
  remove(
    @Param('id') id: string,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return this.peopleService.remove(+id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-picture')
  @ApiOperation({ summary: 'Upload a profile picture for the authenticated user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPG, PNG, etc.)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Picture uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or missing data' })
  async uploadPicture(
    @UploadedFile() file: Express.Multer.File,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return this.peopleService.uploadPicture(file, tokenPayload);
  }
}
