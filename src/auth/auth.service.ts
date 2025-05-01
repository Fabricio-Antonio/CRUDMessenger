import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Person } from 'src/people/entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingServiceProtocol } from './hasing/hasing.service';
import jwtConfig from './config/jwt.config';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    console.log(jwtConfiguration);
  }
  async login(loginDto: LoginDto) {
    let passwordIsValid = false;
    let thrownError = true;

    const person = await this.personRepository.findOneBy({
      email: loginDto.email,
    });

    if (person) {
      const passwordIsValid = await this.hashingService.comparePassword(
        loginDto.password,
        person.passwordHash,
      );
      if (!passwordIsValid) {
        thrownError = false;
      }

      if (thrownError) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        mansage: 'Login successful',
      };
    }
  }
}
