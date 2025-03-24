import { Module } from '@nestjs/common';
import { ManualConceptsController } from './manual-concepts.controller';

@Module({
    controllers: [ManualConceptsController],
})
export class ManulaConceptsModule {}
