import { Controller, Get } from '@nestjs/common';

@Controller('automatic-concepts')
export class AutomaticConceptsController {
    @Get()
    home(): string {
        return 'automatic-concepts';
    }
}
