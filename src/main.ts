import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import cookieParser from 'cookie-parser';
import { Allow } from 'class-validator';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  })


  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('The e-commerce API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token', // Access token security scheme
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'refresh-token', // Refresh token security scheme
    )
    .addServer('https://snt7njkj-3001.inc1.devtunnels.ms/api', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        // in the DTO we have @Type(() => Number)
        // This will allow the transformation of the data to the correct type
        // This is useful when the data is not in the correct type
        // For example, if the data is a string, it will be converted to a number
        // If the data is a string, it will be converted to a number
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        return new HttpException(
          {
            message: errors.map(e => Object.values(e.constraints || {})).flat(),
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  await app.listen(3001);

  console.log(`Application is running on: ${await app.getUrl()}/api`);
  console.log(`Swagger docs available at: ${await app.getUrl()}/api/docs`);

}

bootstrap();