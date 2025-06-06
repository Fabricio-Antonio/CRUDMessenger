import { EmailService } from '../src/email/email.service';

beforeAll(() => {
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
