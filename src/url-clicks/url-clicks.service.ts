import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../auth/schemas/url.schema';

@Injectable()
export class UrlClicksService {
    private readonly logger = new Logger(UrlClicksService.name);

    constructor(
        @InjectRepository(Url) private urlRepository: Repository<Url>,
    ) { }

    async updateUrlClicks(shortUrl: string) {
        this.logger.log(`Updating clicks for URL with short code: ${shortUrl}`);
        const url = await this.urlRepository.findOne({ where: { short_code: shortUrl } });
        if (!url) {
            this.logger.warn(`URL with short code ${shortUrl} not found`);
            throw new HttpException('url not found', HttpStatus.NOT_FOUND);
        }
        url.clicks += 1;
        this.logger.log(`URL with short code ${shortUrl} has been clicked ${url.clicks} times`);
        return await this.urlRepository.save(url);
    }
}
