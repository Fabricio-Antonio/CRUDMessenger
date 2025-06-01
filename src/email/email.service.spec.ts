import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn();

    const createTransportMock = {
      sendMail: sendMailMock,
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(createTransportMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should send email with correct parameters', async () => {
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const content = 'Hello World';

    process.env.EMIL_FROM = 'noreply@example.com';

    await service.sendEmail(to, subject, content);

    expect(sendMailMock).toHaveBeenCalledWith({
      from: `"No Reply" <${process.env.EMIL_FROM}>`,
      to,
      subject,
      text: content,
    });
  });
});
