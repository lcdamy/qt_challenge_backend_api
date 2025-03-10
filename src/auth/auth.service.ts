import { HttpException, HttpStatus, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
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
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>,
        private jwtService: JwtService
    ) { }

    async signUp(signupData: CreateUserDto) {
        this.logger.log(`Attempting to sign up user with email: ${signupData.email}`);
        const emailExists = await this.userRepository.findOne({ where: { email: signupData.email } });
        if (emailExists) {
            this.logger.warn(`Email already exists: ${signupData.email}`);
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }

        const usernameExists = await this.userRepository.findOne({ where: { username: signupData.username } });
        if (usernameExists) {
            this.logger.warn(`Username already exists: ${signupData.username}`);
            throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(signupData.password, 10);
        signupData.password = hashedPassword;

        const user = await this.userRepository.save(signupData);
        this.logger.log(`User signed up successfully with email: ${signupData.email}`);
        return user;
    }

    async signIn(credentials: { email: string, password: string }) {
        this.logger.log(`Attempting to sign in user with email: ${credentials.email}`);
        const user = await this.userRepository.findOne({ where: { email: credentials.email } });
        if (!user) {
            this.logger.warn(`User not found with email: ${credentials.email}`);
            throw new UnauthorizedException("User not found");
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            this.logger.warn(`Invalid password for user with email: ${credentials.email}`);
            throw new UnauthorizedException('Invalid password');
        }

        this.logger.log(`User signed in successfully with email: ${credentials.email}`);
        return this.generateToken(user);
    }

    async generateToken(user: User) {
        this.logger.log(`Generating token for user with email: ${user.email}`);
        const payload = { email: user.email, id: user.id, name: user.username };
        const refreshToken = uuidv4();
        await this.storeRefreshToken(refreshToken, user.id.toString());
        this.logger.log(`Token generated successfully for user with email: ${user.email}`);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken
        };
    }

    async storeRefreshToken(refreshToken: string, userId: string) {
        this.logger.log(`Storing refresh token for user with ID: ${userId}`);
        const token = await this.refreshTokenRepository.findOne({ where: { userId: userId } }) || new RefreshToken();
        token.token = refreshToken;
        token.userId = userId;
        token.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
        const savedToken = await this.refreshTokenRepository.save(token);
        this.logger.log(`Refresh token stored successfully for user with ID: ${userId}`);
        return savedToken;
    }

    async refreshToken(refreshToken: RefreshTokenDto) {
        this.logger.log(`Attempting to refresh token`);
        const token = await this.refreshTokenRepository.findOne({ where: { token: refreshToken.token } });
        if (!token) {
            this.logger.warn(`Invalid refresh token`);
            throw new UnauthorizedException('Invalid refresh token');
        }
        if (token.expires < new Date()) {
            this.logger.warn(`Refresh token expired`);
            throw new UnauthorizedException('Refresh token expired');
        }
        await this.refreshTokenRepository.delete({ token: refreshToken.token });
        const user = await this.userRepository.findOne({ where: { id: Number(token.userId) } });
        if (!user) {
            this.logger.warn(`User not found with ID: ${token.userId}`);
            throw new UnauthorizedException('User not found');
        }
        this.logger.log(`Token refreshed successfully for user with ID: ${token.userId}`);
        return this.generateToken(user);
    }

    async logout(refreshToken: RefreshTokenDto) {
        this.logger.log(`Attempting to logout`);
        const token = await this.refreshTokenRepository.findOne({ where: { token: refreshToken.token } });
        if (!token) {
            this.logger.warn(`Invalid refresh token`);
            throw new UnauthorizedException('Invalid refresh token');
        }
        await this.refreshTokenRepository.delete({ token: refreshToken.token });
        this.logger.log(`Logout successful`);
        return { message: 'Logout successful' };
    }

    async getRefreshToken(getRefreshTokenDto: { email: string }) {
        this.logger.log(`Attempting to get refresh token for user with email: ${getRefreshTokenDto.email}`);
        const user = await this.userRepository.findOne({ where: { email: getRefreshTokenDto.email } });
        if (!user) {
            this.logger.warn(`User not found with email: ${getRefreshTokenDto.email}`);
            throw new UnauthorizedException('User not found');
        }
        const token = await this.refreshTokenRepository.findOne({ where: { userId: user.id.toString() } });
        if (!token) {
            this.logger.warn(`Refresh token not found for user with email: ${getRefreshTokenDto.email}`);
            throw new UnauthorizedException('Refresh token not found');
        }
        this.logger.log(`Refresh token retrieved successfully for user with email: ${getRefreshTokenDto.email}`);
        return { token: token.token };
    }

}
