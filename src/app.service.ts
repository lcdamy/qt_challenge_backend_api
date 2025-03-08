import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth/schemas/user.schema';
import { Repository } from 'typeorm';
import { Url } from './auth/schemas/url.schema';
import { CreateShortenUrlDto } from './auth/dtos/create-shorten-url-dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Url) private urlRepository: Repository<Url>,
  ) { }

  async getLinks(user: User) {
    return await this.urlRepository.find({ where: { user: { id: user.id } } });
  }
  async getAnalytics(shortUrl: string, user: User) {
    const url = await this.urlRepository.findOne({ where: { short_code: shortUrl, user: { id: user.id } } });
    if (!url) {
      throw new HttpException('url not found', HttpStatus.NOT_FOUND);
    }
    return url;
  }
  // create a short url code and save the long url
  async shortenUrl(createShortenUrlDto: CreateShortenUrlDto, user: User) {
    const existingUrl = await this.urlRepository.findOne({ where: { long_url: createShortenUrlDto.long_url, user: { id: user.id } } });
    if (existingUrl) {
      throw new HttpException('long url already exists', HttpStatus.BAD_REQUEST);
    }
    const shortUrl = Math.random().toString(36).substring(7);
    const url = new Url();
    url.long_url = createShortenUrlDto.long_url;
    url.short_code = shortUrl;
    url.user = user;
    return await this.urlRepository.save(url);
  }
}
