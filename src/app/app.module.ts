import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManulaConceptsModule } from 'src/manual-concepts/manual-concepts.module';
import { AutomaticConceptsModule } from 'src/automatic-concepts/automatic-concepts.module';

@Module({
  imports: [ManulaConceptsModule, AutomaticConceptsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
