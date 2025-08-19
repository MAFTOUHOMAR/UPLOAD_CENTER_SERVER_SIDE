import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './prisma/seed.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  const config = new DocumentBuilder()
    .setTitle('UPLOAD CENTER API')
    .setDescription('API documentation for the UPLOAD CENTER.')
    .setVersion('1.0')
    .addTag('Auth', 'Authentication routes')
    .addTag('Categories', 'Manage categories')
    .addTag('Applications', 'Manage applications')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const seedService = app.get(SeedService);
  await seedService.seed();

  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
  console.log(`📘 Swagger UI available at http://localhost:3000/api-docs`);
}
bootstrap();
