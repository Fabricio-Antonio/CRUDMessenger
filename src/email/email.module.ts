import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService, EmailService],
  exports: [EmailService],
})
export class EmailModule {}
