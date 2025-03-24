import { Controller, Get } from '@nestjs/common';

@Controller('manual-concepts')
export class ManualConceptsController {
    @Get()
    home(): string {
    return 'conceitos-manual';
    }
}
