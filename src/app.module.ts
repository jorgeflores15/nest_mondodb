import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { HealthModule } from './health/health.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as morgan from 'morgan';
import { ApiKeyMiddleware } from './middlewares/api-key.middleware';

@Module({
  imports: [
    ProductModule,
    CategoryModule,
    HealthModule,
    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const logFormat =
      process.env.NODE_ENV === 'production'
        ? '[:date[iso]] :method :url :status'
        : 'dev';

    consumer
      .apply(morgan(logFormat))
      .forRoutes({ path: '*', method: RequestMethod.ALL })

      .apply(ApiKeyMiddleware)
      .exclude({ path: 'docs', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
