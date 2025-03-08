import { Module } from '@nestjs/common';
import { UrlClicksService } from './url-clicks.service';
import { UrlClicksController } from './url-clicks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from 'src/auth/schemas/url.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  providers: [UrlClicksService],
  controllers: [UrlClicksController]
})
export class UrlClicksModule {}
