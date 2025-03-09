import { Controller, Put, Param, Logger, Get, Query, Res } from '@nestjs/common';
import { UrlClicksService } from './url-clicks.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class UrlClicksController {
  private readonly logger = new Logger(UrlClicksController.name);
  constructor(private readonly urlClicksService: UrlClicksService) { }

  @Get(':shortUrl')
  @ApiOperation({ summary: 'Redirect user to original URL' })
  @ApiResponse({ status: 200, description: 'User redirected successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async redirectUserToOrginalLink(@Param('shortUrl') shortUrl: string, @Query('utm_source') utmSource: string, @Res() res: Response) {
    this.logger.log(`Redirecting user to original URL`);
    try {
      const url = await this.urlClicksService.redirectUserToOriginalLink(shortUrl);
      return res.redirect(url);
    } catch (error) {
      this.logger.error(`Failed to redirect user to original URL`, error.stack);
      throw error;
    }
  }

}
