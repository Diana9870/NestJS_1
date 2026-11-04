import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cinema API')
    .setDescription(
      'Films, halls, showings and seat bookings. Data is kept in memory and lost on restart. Prices are integers in kopiykas (12500 = 125 UAH).',
    )
    .setVersion('1.0')
    .build();
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  const port = Number(app.get(ConfigService).get('PORT') ?? 3000);
  await app.listen(port);
}

void bootstrap();
