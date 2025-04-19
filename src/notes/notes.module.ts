// notes.module.ts
import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), PeopleModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
