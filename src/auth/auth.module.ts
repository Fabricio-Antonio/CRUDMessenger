import { Global, Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hasing/hasing.service';
import { BcryptService } from './hasing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/people/entities/person.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
    AuthService,
  ],
  exports: [HashingServiceProtocol],
})
export class AuthModule {}
