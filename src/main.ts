import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Minha API')
    .setDescription('Descrição da minha API')
    .setVersion('1.0')
    .addTag('treinos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Usando a variável de ambiente PORT (definido pelo Vercel ou outro servidor)
  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();
