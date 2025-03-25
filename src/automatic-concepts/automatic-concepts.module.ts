import { Module } from '@nestjs/common';
import { AutomaticConceptsController } from './automatic-concepts.controller';
import { AutomaticConceptsService } from './automatic-concepts.service';

@Module({
  controllers: [AutomaticConceptsController],
  providers: [AutomaticConceptsService],
})
export class AutomaticConceptsModule {}
