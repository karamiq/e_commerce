// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (Array.isArray((res as any).message)) {
        message = (res as any).message.join(', ');
      } else if ((res as any).message) {
        message = (res as any).message;
      } else if ((res as any).error) {
        message = (res as any).error;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }
    response.status(status).json({
      data: {},          // ✅ ALWAYS object
      message,
      statusCode: status,
    });
  }
}
