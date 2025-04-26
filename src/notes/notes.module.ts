// notes.module.ts
import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';
import { NotesUtils } from './notes.utils';
import { RegexProtocol } from 'src/common/regex/regex.protocol';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spacees.regex';
import { OnlyLowerCaseLettersRegex } from 'src/common/regex/only-lowercase-latters.regex';
import { SERVER_NAME } from './notes.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), PeopleModule],
  controllers: [NotesController],
  providers: [
    NotesService,
    NotesUtils,
    {
      provide: SERVER_NAME,
      useValue: 'My Name Is NestJS',
    },
    {
      provide: RegexProtocol,
      useClass: 1 !== 1 ? RemoveSpacesRegex : OnlyLowerCaseLettersRegex,
    },
  ],
})
export class NotesModule {}
