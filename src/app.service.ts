import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth/schemas/user.schema';
import { Repository } from 'typeorm';
import { Url } from './auth/schemas/url.schema';
import { CreateShortenUrlDto } from './auth/dtos/create-shorten-url-dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Url) private urlRepository: Repository<Url>,
  ) { }

  async getLinks(user: User) {
    this.logger.log(`Fetching links for user with id: ${user.id}`);
    return await this.urlRepository.find({ where: { user: { id: user.id } } });
  }

  async getAnalytics(shortUrl: string, user: User) {
    this.logger.log(`Fetching analytics for shortUrl: ${shortUrl} and user id: ${user.id}`);
    const url = await this.urlRepository.findOne({ where: { short_code: shortUrl, user: { id: user.id } } });
    if (!url) {
      this.logger.warn(`URL not found for shortUrl: ${shortUrl} and user id: ${user.id}`);
      throw new HttpException('url not found', HttpStatus.NOT_FOUND);
    }
    return url;
  }

  async shortenUrl(createShortenUrlDto: CreateShortenUrlDto, user: User) {
    this.logger.log(`Creating short URL for longUrl: ${createShortenUrlDto.long_url} and user id: ${user.id}`);
    const existingUrl = await this.urlRepository.findOne({ where: { long_url: createShortenUrlDto.long_url, user: { id: user.id } } });
    if (existingUrl) {
      this.logger.warn(`Long URL already exists for longUrl: ${createShortenUrlDto.long_url} and user id: ${user.id}`);
      throw new HttpException('long url already exists', HttpStatus.BAD_REQUEST);
    }
    const shortUrl = Math.random().toString(36).substring(7);
    const url = new Url();
    url.long_url = createShortenUrlDto.long_url;
    url.short_code = shortUrl;
    url.user = user;
    const savedUrl = await this.urlRepository.save(url);
    this.logger.log(`Short URL created with shortCode: ${shortUrl} for user id: ${user.id}`);
    return savedUrl;
  }
}
