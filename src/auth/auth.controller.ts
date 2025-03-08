import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../auth/dtos/create-user-dto';
import { LoginUserDto } from './dtos/login-user-dto';
import { RefreshTokenDto } from './dtos/reflesh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //signup
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.signUp(createUserDto);
    } catch (error) {
      return { message: error.message };
    }
  }
  //signin
  @Post('signin')
  async signIn(@Body() credentials: LoginUserDto) {
    try {
      return await this.authService.signIn(credentials);
    } catch (error) {
      return { message: error.message };
    }
  }
  //logout
  //token refres
  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: RefreshTokenDto ) {
    try {
      return await this.authService.refreshToken(refreshToken);
    } catch (error) {
      return { message: error.message };
    }
  }

}
