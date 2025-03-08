import { Controller, Put, Param, Logger } from '@nestjs/common';
import { UrlClicksService } from './url-clicks.service';

@Controller('url-clicks')
export class UrlClicksController {
  private readonly logger = new Logger(UrlClicksController.name);

  constructor(private readonly urlClicksService: UrlClicksService) {}

  @Put('update/:shortUrl')
  async updateClick(@Param('shortUrl') shortUrl: string) {
    this.logger.log(`Received request to update clicks for URL: ${shortUrl}`);
    try {
      const result = await this.urlClicksService.updateUrlClicks(shortUrl);
      this.logger.log(`Successfully updated clicks for URL: ${shortUrl}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update clicks for URL: ${shortUrl}`, error.stack);
      return { message: error.message };
    }
  }
}