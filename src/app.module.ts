import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    CategoryModule,
    ApplicationModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: class {
        intercept(context, next) {
          const response = context.switchToHttp().getResponse();
          response.header('Access-Control-Allow-Origin', '*');
          response.header(
            'Access-Control-Allow-Methods',
            'GET,PUT,POST,DELETE,OPTIONS',
          );
          response.header(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization, Content-Length, X-Requested-With',
          );
          return next.handle();
        }
      },
    },
  ],
})
export class AppModule {}
