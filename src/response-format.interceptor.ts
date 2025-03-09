import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const utm_source = request.query.utm_source;
        // Check if the request matches the specific endpoint and method
        if (method === 'GET' && utm_source) {
            return next.handle();
        }

        return next.handle().pipe(
            map(data => ({
                success: true,
                data,
                message: 'Request processed successfully',
                timestamp: new Date().toISOString(),
            })),
            catchError(err => {
                return of({
                    success: false,
                    data: null,
                    message: err.response?.message || err.message || 'An error occurred',
                    timestamp: new Date().toISOString(),
                });
            }),
        );
    }
}
