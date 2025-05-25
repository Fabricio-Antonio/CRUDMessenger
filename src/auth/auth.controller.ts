import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-toke-token.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('refresh')
  @ApiBearerAuth()
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
