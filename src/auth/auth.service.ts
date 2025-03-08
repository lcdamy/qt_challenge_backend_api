import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { User } from './schemas/user.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenDto } from './dtos/reflesh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>,
        private jwtService: JwtService
    ) { }

    async signUp(signupData: CreateUserDto) {
        const emailExists = await this.userRepository.findOne({ where: { email: signupData.email } });
        if (emailExists) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }

        const usernameExists = await this.userRepository.findOne({ where: { username: signupData.username } });
        if (usernameExists) {
            throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(signupData.password, 10);
        signupData.password = hashedPassword;

        return await this.userRepository.save(signupData);
    }

    async signIn(credentials: { email: string, password: string }) {
        const user = await this.userRepository.findOne({ where: { email: credentials.email } });
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return this.generateToken(user);
    }

    async generateToken(user: User) {
        const payload = { email: user.email, id: user.id };
        const refreshToken = uuidv4();
        await this.storeRefreshToken(refreshToken, user.id.toString());
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken
        };
    }

    async storeRefreshToken(refreshToken: string, userId: string) {
        const token = await this.refreshTokenRepository.findOne({ where: { userId: userId } }) || new RefreshToken();
        token.token = refreshToken;
        token.userId = userId;
        token.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
        return await this.refreshTokenRepository.save(token);
    }

    async refreshToken(refreshToken: RefreshTokenDto) {
        const token = await this.refreshTokenRepository.findOne({ where: { token: refreshToken.token } });
        if (!token) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        if (token.expires < new Date()) {
            throw new UnauthorizedException('Refresh token expired');
        }
        await this.refreshTokenRepository.delete({ token: refreshToken.token });
        const user = await this.userRepository.findOne({ where: { id: Number(token.userId) } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return this.generateToken(user);
    }
}




