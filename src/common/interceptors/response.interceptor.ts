// response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paginated } from '../pagination/interfaces/paginated.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        const item = data.data ?? data;
        const meta = data.meta ?? {};
        const messege = 'Success';
        return {
          data: item,
          ...meta,
          message: messege,
          statusCode: res.statusCode,
        }
      }),
    );
  }
}
