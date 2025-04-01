import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';

@Module({
  controllers: [NotesController],
})
export class NotesModule {}
