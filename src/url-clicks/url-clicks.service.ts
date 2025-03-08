import { Injectable, HttpException, HttpStatus, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../auth/schemas/url.schema';


@Injectable()
export class UrlClicksService {
    constructor(
        @InjectRepository(Url) private urlRepository: Repository<Url>,
    ) { }

    async updateUrlClicks(shortUrl: string) {
        const url = await this.urlRepository.findOne({ where: { short_code: shortUrl } });
        if (!url) {
            throw new HttpException('url not found', HttpStatus.NOT_FOUND);
        }
        url.clicks += 1;
        return await this.urlRepository.save(url);
    }
}
