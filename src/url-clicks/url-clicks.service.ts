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

    async redirectUserToOriginalLink(shortUrl: string) {
        this.logger.log(`Redirecting user to original URL`);
        const url = await this.urlRepository.findOne({ where: { short_code: shortUrl } });
        if (!url) {
            this.logger.warn(`URL with short code ${shortUrl} not found`);
            throw new HttpException('url not found', HttpStatus.NOT_FOUND);
        }
        url.clicks += 1;
        this.logger.log(`Redirecting user to original URL: ${url.long_url}`);
        await this.urlRepository.save(url);
        return url.long_url;
    }
}
