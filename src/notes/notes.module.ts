// notes.module.ts
import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';
import { NotesUtils } from './notes.utils';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spacees.regex';
import { OnlyLowerCaseLettersRegex } from 'src/common/regex/only-lowercase-latters.regex';
import {
  ONLY_LOWERCASE_LETTERS,
  REMOVE_SPACES,
  SERVER_NAME,
} from './notes.constants';

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
      provide: ONLY_LOWERCASE_LETTERS,
      useClass: OnlyLowerCaseLettersRegex,
    },
    {
      provide: REMOVE_SPACES,
      useClass: RemoveSpacesRegex,
    },
  ],
})
export class NotesModule {}
