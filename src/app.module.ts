import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/schemas/user.schema';
import { RefreshToken } from './auth/schemas/refresh-token.schema';
import { JwtModule } from '@nestjs/jwt';
import { Url } from './auth/schemas/url.schema';
import { UrlClicksModule } from './url-clicks/url-clicks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [User, RefreshToken, Url],
        synchronize: true,
      }),
    }),
    AuthModule,
    TypeOrmModule.forFeature([User, RefreshToken,Url]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
      global: true
    }),
    UrlClicksModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
