import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '../people/entities/person.entity';
import { UnauthorizedException } from '@nestjs/common';
import { HashingServiceProtocol } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';

const personMock = {
  id: 1,
  email: 'test@example.com',
  passwordHash: 'hashed-password',
  active: true,
} as Person;

const mockPersonRepository = {
  findOneBy: jest.fn(),
};

const mockHashingService = {
  comparePassword: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Person), useValue: mockPersonRepository },
        { provide: HashingServiceProtocol, useValue: mockHashingService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: jwtConfig.KEY,
          useValue: {
            secret: 'test-secret',
            jwtTtl: 3600,
            jwtRefreshTtl: 604800,
            issuer: 'test-issuer',
            audience: 'test-audience',
          } satisfies ConfigType<typeof jwtConfig>,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return tokens when credentials are valid', async () => {
      mockPersonRepository.findOneBy.mockResolvedValue(personMock);
      mockHashingService.comparePassword.mockResolvedValue(true);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login({
        email: 'test@example.com',
        password: 'plaintext',
      });

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPersonRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.login({ email: 'notfound@test.com', password: '123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPersonRepository.findOneBy.mockResolvedValue(personMock);
      mockHashingService.comparePassword.mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens if refreshToken is valid', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: personMock.id });
      mockPersonRepository.findOneBy.mockResolvedValue(personMock);
      mockJwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await service.refreshTokens({
        refreshToken: 'valid-token',
      });

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });

    it('should throw if refreshToken is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(
        service.refreshTokens({ refreshToken: 'invalid' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if user is not found by refreshToken', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 999 });
      mockPersonRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.refreshTokens({ refreshToken: 'some-token' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
