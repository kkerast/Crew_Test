import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log(
    'host:',
    process.env.DB_HOST,
    '\n',
    'port:',
    +process.env.DB_PORT,
    '\n',
    'username:',
    process.env.DB_USERNAME,
    '\n',
    'password:',
    process.env.DB_PASSWORD,
    '\n',
    'database:',
    process.env.DB_DATABASE,
    '\n',
  );
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe()); // 입력값 유효성 검사를 위한 ValidationPipe 추가
  app.setGlobalPrefix('api'); //글로벌 프리픽스 설정

  const config = new DocumentBuilder()
    .setTitle('CREW API Document')
    .setDescription('Crew API 서버 ')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'authorization',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'accessToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(80);
}
bootstrap();
