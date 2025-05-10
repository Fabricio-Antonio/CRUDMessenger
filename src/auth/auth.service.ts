import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Person } from 'src/people/entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingServiceProtocol } from './hashing/hasing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-toke-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const person = await this.personRepository.findOneBy({
      email: loginDto.email,
      active: true,
    });

    if (!person) {
      throw new UnauthorizedException('Unauthorized acess');
    }

    const passwordIsValid = await this.hashingService.comparePassword(
      loginDto.password,
      person.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('invalid credentials');
    }
    return this.createTokens(person);
  }

  private async createTokens(person: Person) {
    const accessTokenPromise = this.signJwtAsync<Partial<Person>>(
      person.id,
      this.jwtConfiguration.jwtTtl,
      { email: person.email },
    );

    const refreshTokenPromise = this.signJwtAsync(
      person.id,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  private async signJwtAsync<T>(sub: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<{ sub: number }>(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      );
      const person = await this.personRepository.findOneBy({
        id: sub,
        active: true,
      });
      if (!person) {
        throw new Error('Unauthorized access');
      }
      return this.createTokens(person);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException('An unknown error occurred');
    }
  }
}
