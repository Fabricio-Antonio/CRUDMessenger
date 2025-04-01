import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  //@Get('hello')
  getHello(): string {
    return 'Qualquer coisa';
  }

  //@Get('example')
  example() {
    return this.appService.soluctionExample();
  }
}
