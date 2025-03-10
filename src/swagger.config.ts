import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('QT API')
    .setDescription('This Api is for the QT application challenge.')
    .setContact('lcdamy', 'https://www.linkedin.com/in/pierre-damien-murindangabo-cyuzuzo-709b53151/', 'zudanga@gmail.com')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);
}
