import { CanActivate, ExecutionContext, Injectable, UnauthorizedException,Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(private jwtService: JwtService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;
        if (!authHeader) {
            this.logger.warn('No token provided');
            throw new UnauthorizedException({
                success: false,
                data: null,
                message: 'No token provided',
                timestamp: new Date().toISOString(),
            });
        }
        const token = authHeader.split(' ')[1];
        try {
            const payload = this.jwtService.verify(token);
            request.user = payload;
            this.logger.log('Token verified successfully');
        } catch (error) {
            this.logger.error('Invalid token', error.stack);
            throw new UnauthorizedException({
                success: false,
                data: null,
                message: 'Invalid token',
                timestamp: new Date().toISOString(),
            });
        }
        return true;
    }
}