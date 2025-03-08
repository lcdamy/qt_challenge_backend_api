import { Controller, Put, Param } from '@nestjs/common';
import { UrlClicksService } from './url-clicks.service';


@Controller('url-clicks')
export class UrlClicksController {
    constructor(private readonly urlClicksService: UrlClicksService) {}

    @Put('update/:shortUrl')
    async updateClick(@Param('shortUrl') shortUrl: string) {
      try {
        return this.urlClicksService.updateUrlClicks(shortUrl);
      } catch (error) {
        return { message: error.message };
      }
    }
  }