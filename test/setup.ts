import { EmailService } from '../src/email/email.service';
import { execSync } from 'child_process';

beforeAll(() => {
  execSync('node scripts/clean-test-db.ts');

  process.env.NODE_ENV = 'test';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_USERNAME = 'postgres';
  process.env.DB_PASSWORD = 'postgres';
  process.env.DB_NAME = 'testing';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.JWT_TOKEN_AUDIENCE = 'test-audience';
  process.env.JWT_TOKEN_ISSUER = 'test-issuer';
  process.env.JWT_TTL = '3600';
  process.env.JWT_REFRESH_TTL = '86400';
  process.env.EMAIL_HOST = 'localhost';
  process.env.EMAIL_PORT = '1025';
  process.env.EMAIL_USER = 'test@example.com';
  process.env.EMAIL_PASS = 'password';
  process.env.EMAIL_FROM = 'noreply@example.com';

  const testFile = expect.getState().testPath;
  if (!testFile?.includes('email.e2e-spec.ts')) {
    jest
      .spyOn(EmailService.prototype, 'sendEmail')
      .mockImplementation(() => Promise.resolve());
  }
});

afterEach(() => {
  jest.clearAllMocks();
});
