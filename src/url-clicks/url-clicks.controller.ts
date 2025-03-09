import { Controller, Put, Param, Logger, Get, Query, Res } from '@nestjs/common';
import { UrlClicksService } from './url-clicks.service';
import { Response } from 'express';

@Controller()
export class UrlClicksController {
  private readonly logger = new Logger(UrlClicksController.name);
  constructor(private readonly urlClicksService: UrlClicksService) {}

  @Get(':shortUrl')
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
