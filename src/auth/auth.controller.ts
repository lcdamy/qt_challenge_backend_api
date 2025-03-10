import { Body, Controller, Post, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../auth/dtos/create-user-dto';
import { LoginUserDto } from './dtos/login-user-dto';
import { RefreshTokenDto } from './dtos/reflesh-token.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetRefreshTokenDto } from './dtos/get-reflesh-token.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  //signup
  @Post('signup')
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'User signed in successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiOperation({ summary: 'Refresh' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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

//get refresh token
  @Post('get-refresh-token')
  @ApiOperation({ summary: 'Get refresh' })
  @ApiResponse({ status: 200, description: 'Refresh token' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getRefreshToken(@Body() getRefreshTokenDto: GetRefreshTokenDto) {
    this.logger.log('GetRefreshToken request received');
    try {
      const result = await this.authService.getRefreshToken(getRefreshTokenDto);
      this.logger.log('GetRefreshToken successful');
      return result;
    } catch (error) {
      this.logger.error('GetRefreshToken failed', error.stack);
      throw error;
    }
  }

}
