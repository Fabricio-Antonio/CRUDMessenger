import { Controller, Get } from '@nestjs/common';
import { ManualConceptsService } from './manual-concepts.service';

@Controller('manual-concepts')
export class ManualConceptsController {
  constructor(private readonly manualConceptsService: ManualConceptsService) {}

  @Get()
  home(): string {
    return this.manualConceptsService.HomeSolution();
  }
}
