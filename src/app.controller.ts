import { Body, Controller, Get, Post, Req, UseGuards, Param, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { CreateShortenUrlDto } from './auth/dtos/create-shorten-url-dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) { }

  @Get('urls')
  @ApiOperation({ summary: 'Get all URLs' })
  @ApiResponse({ status: 200, description: 'URLs fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getLinks(@Req() req) {
    this.logger.log('Fetching links for user');
    try {
      return await this.appService.getLinks(req.user);
    } catch (error) {
      this.logger.error('Error fetching links', error.stack);
      throw error;
    }
  }

  @Get('analytics/:shortUrl')
  @ApiOperation({ summary: 'Get analytics' })
  @ApiResponse({ status: 200, description: 'Analytics fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getAnalytics(@Param('shortUrl') shortUrl: string, @Req() req) {
    this.logger.log(`Fetching analytics for shortUrl: ${shortUrl}`);
    try {
      return await this.appService.getAnalytics(shortUrl, req.user);
    } catch (error) {
      this.logger.error(`Error fetching analytics for shortUrl: ${shortUrl}`, error.stack);
      throw error;
    }
  }

  @Post('shorten')
  @ApiOperation({ summary: 'Shorten URL' })
  @ApiResponse({ status: 201, description: 'URL shortened successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async shortenUrl(@Body() createShortenUrlDto: CreateShortenUrlDto, @Req() req) {
    this.logger.log('Shortening URL');
    try {
      return this.appService.shortenUrl(createShortenUrlDto, req.user);
    } catch (error) {
      this.logger.error('Error shortening URL', error.stack);
      throw error;
    }
  }
}