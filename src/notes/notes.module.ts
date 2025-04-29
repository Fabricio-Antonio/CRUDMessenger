// notes.module.ts
import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';
import { NotesUtils } from './notes.utils';
import { MyDynamicModule } from 'src/my-dynamic/my-dynamic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    PeopleModule,
    MyDynamicModule.register({
      apiKey: 'API KEY here',
      apiUrl: 'http://test.com',
    }),
  ],
  controllers: [NotesController],
  providers: [NotesService, NotesUtils],
})
export class NotesModule {}
