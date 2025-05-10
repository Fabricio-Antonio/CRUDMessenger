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

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  findAll() {
    return this.peopleService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peopleService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return this.peopleService.update(+id, updatePersonDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return this.peopleService.remove(+id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-picture')
  uploadPicture(
    @UploadedFile() file: Express.Multer.File,
    @TokenPayload() tokenPayload: TokenPayloadDto,
  ) {
    return {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: {},
      size: file.size,
    };
  }
}
