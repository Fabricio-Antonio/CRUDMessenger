import { Module } from '@nestjs/common';
import { AutomaticConceptsController } from './automatic-concepts.controller';

@Module({
  controllers: [AutomaticConceptsController]
})
export class AutomaticConceptsModule {}
