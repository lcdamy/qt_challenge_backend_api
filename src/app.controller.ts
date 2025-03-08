import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { CreateShortenUrlDto } from './auth/dtos/create-shorten-url-dto';


@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('urls')
  async getLinks(@Req() req) {
    try {
      return await this.appService.getLinks(req.user);
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get('analytics/:shortUrl')
  async getAnalytics(@Req() req) {
    try {
      return await this.appService.getAnalytics(req.params.shortUrl, req.user);
    } catch (error) {
      return { message: error.message };
    }
  }

  @Post('shorten')
  async shortenUrl(@Body() createShortenUrlDto: CreateShortenUrlDto, @Req() req) {
    try {
      return this.appService.shortenUrl(createShortenUrlDto, req.user);
    } catch (error) {
      return { message: error.message };
    }
  }

}
