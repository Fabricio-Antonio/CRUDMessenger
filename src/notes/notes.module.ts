// notes.module.ts
import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';
import { NotesUtils } from './notes.utils';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), PeopleModule, EmailModule],
  controllers: [NotesController],
  providers: [NotesService, NotesUtils],
})
export class NotesModule {}
