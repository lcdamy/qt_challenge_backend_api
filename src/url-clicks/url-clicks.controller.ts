import { Controller, Put, Param, Logger, Get, Query, Res } from '@nestjs/common';
import { UrlClicksService } from './url-clicks.service';
import { Response } from 'express';

@Controller()
export class UrlClicksController {
  private readonly logger = new Logger(UrlClicksController.name);

  constructor(private readonly urlClicksService: UrlClicksService) {}

  @Put('url-clicks/update/:shortUrl')
  async updateClick(@Param('shortUrl') shortUrl: string) {
    this.logger.log(`Received request to update clicks for URL: ${shortUrl}`);
    try {
      const result = await this.urlClicksService.updateUrlClicks(shortUrl);
      this.logger.log(`Successfully updated clicks for URL: ${shortUrl}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update clicks for URL: ${shortUrl}`, error.stack);
      throw error;
    }
  }

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
