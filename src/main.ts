import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  HttpException,
  HttpStatus,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        return new HttpException(
          {
            message: errors
              .map((e) => Object.values(e.constraints || {}))
              .flat(),
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  await app.listen(3001);

  console.log(`Application is running on: ${await app.getUrl()}/api`);
  console.log(
    `Import Postman docs from: postman/E-Commerce.postman_collection.json`,
  );
}

bootstrap();
