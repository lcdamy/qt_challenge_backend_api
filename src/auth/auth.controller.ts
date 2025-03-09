import { Body, Controller, Post, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../auth/dtos/create-user-dto';
import { LoginUserDto } from './dtos/login-user-dto';
import { RefreshTokenDto } from './dtos/reflesh-token.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  //signup
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    this.logger.log('SignUp request received');
    try {
      const result = await this.authService.signUp(createUserDto);
      this.logger.log('SignUp successful');
      return result;
    } catch (error) {
      this.logger.error('SignUp failed', error.stack);
      throw error;
    }
  }

  //signin
  @Post('signin')
  async signIn(@Body() credentials: LoginUserDto) {
    this.logger.log('SignIn request received');
    try {
      const result = await this.authService.signIn(credentials);
      this.logger.log('SignIn successful');
      return result;
    } catch (error) {
      this.logger.error('SignIn failed', error.stack);
      throw error;
    }
  }

  //token refresh
  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    this.logger.log('RefreshToken request received');
    try {
      const result = await this.authService.refreshToken(refreshToken);
      this.logger.log('RefreshToken successful');
      return result;
    } catch (error) {
      this.logger.error('RefreshToken failed', error.stack);
      throw error;
    }
  }

  //logout
  @Post('logout')
  async logout(@Body() refreshToken: RefreshTokenDto) {
    this.logger.log('Logout request received');
    try {
      const result = await this.authService.logout(refreshToken);
      this.logger.log('Logout successful');
      return result;
    } catch (error) {
      this.logger.error('Logout failed', error.stack);
      throw error;
    }
  }
}
