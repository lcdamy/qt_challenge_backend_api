import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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
