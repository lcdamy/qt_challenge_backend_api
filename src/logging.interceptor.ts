import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { CustomLoggerService } from './custom-logger.service';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: CustomLoggerService) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const now = Date.now();
      return next.handle().pipe(
        tap(() => {
          const request = context.switchToHttp().getRequest();
          const response = context.switchToHttp().getResponse();
          const { method, url } = request;
          const { statusCode } = response;
  
          this.logger.log(
            `${method} ${url} ${statusCode} - ${Date.now() - now}ms`,
          );
        }),
      );
    }
  }
  