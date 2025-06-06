import { Test } from '@nestjs/testing';
import { EmailService } from '../src/email/email.service';

// Mock do EmailService
class MockEmailService {
  async sendEmail() {
    return Promise.resolve();
  }
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      {
        provide: EmailService,
        useClass: MockEmailService,
      },
    ],
  }).compile();

  const emailService = moduleRef.get<EmailService>(EmailService);
  jest
    .spyOn(emailService, 'sendEmail')
    .mockImplementation(() => Promise.resolve());
});
