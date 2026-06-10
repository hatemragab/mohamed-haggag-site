import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { validateEnv } from './config/env.validation';
import { ContactModule } from './contact/contact.module';
import { HealthController } from './health/health.controller';
import { I18nExceptionFilter } from './i18n/i18n-exception.filter';
import { LessonsModule } from './lessons/lessons.module';
import { MeModule } from './me/me.module';
import { OrdersModule } from './orders/orders.module';
import { PlansModule } from './plans/plans.module';
import { SiteContentModule } from './site-content/site-content.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    // Guard applied selectively (auth endpoints) — see AuthController.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(
          'MONGO_URI',
          'mongodb://127.0.0.1:27018/haggag',
        ),
      }),
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    LessonsModule,
    PlansModule,
    OrdersModule,
    TestimonialsModule,
    SiteContentModule,
    MeModule,
    AdminModule,
    ContactModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_FILTER, useClass: I18nExceptionFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
