import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EmailModule } from '../src/email/email.module';
import { EmailService } from '../src/email/email.service';
import { SMTPServer, SMTPServerAddress } from 'smtp-server';
import { Readable } from 'stream';

interface ReceivedEmail {
  from?: string;
  to?: string[];
  data: string;
}

describe('EmailService (e2e)', () => {
  let app: INestApplication;
  let emailService: EmailService;
  let smtpServer: SMTPServer;
  let receivedEmails: ReceivedEmail[] = [];

  beforeAll(async () => {
    smtpServer = new SMTPServer({
      authOptional: true,
      disabledCommands: ['AUTH'],
      onData(stream, session, callback) {
        let mailData = '';
        const readableStream = stream as unknown as Readable;
        
        readableStream.on('data', (chunk: Buffer) => {
          mailData += chunk.toString();
        });
        
        readableStream.on('end', () => {
          const mailFrom = session.envelope.mailFrom as SMTPServerAddress;
          const rcptTo = session.envelope.rcptTo as SMTPServerAddress[];
          
          receivedEmails.push({
            from: mailFrom?.address,
            to: rcptTo?.map(rcpt => rcpt.address),
            data: mailData,
          });
          callback();
        });

        readableStream.on('error', (error: Error) => {
          callback(error);
        });
      },
    });

    await new Promise<void>(resolve => {
      smtpServer.listen(0, () => {
        const port = (smtpServer.server?.address() as any).port;
        process.env.EMAIL_HOST = 'localhost';
        process.env.EMAIL_PORT = port.toString();
        process.env.EMAIL_USER = 'test@example.com';
        process.env.EMAIL_PASS = 'password';
        process.env.EMIL_FROM = 'noreply@example.com';
        resolve();
      });
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EmailModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    emailService = moduleFixture.get<EmailService>(EmailService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await new Promise<void>(resolve => {
      smtpServer.close(() => resolve());
    });
  });

  beforeEach(() => {
    receivedEmails = [];
  });

  it('should send an email successfully', async () => {
    const to = 'recipient@example.com';
    const subject = 'Test Email';
    const content = 'This is a test email content';

    await emailService.sendEmail(to, subject, content);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(receivedEmails).toHaveLength(1);
    const sentEmail = receivedEmails[0];
    expect(sentEmail.from).toBe('noreply@example.com');
    expect(sentEmail.to).toContain(to);
    expect(sentEmail.data).toContain(subject);
    expect(sentEmail.data).toContain(content);
  });

  it('should handle email sending with invalid recipient', async () => {
    const to = 'invalid-email';
    const subject = 'Test Email';
    const content = 'This is a test email content';

    await expect(emailService.sendEmail(to, subject, content))
      .rejects
      .toThrow();
  });
});
