import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import { envs } from './config';
import { AnalyzeModule } from './modules/analyze/analyze.module';
import { AuthModule } from './modules/auth/auth.module';
import { EnterprisesModule } from './modules/enterprises/enterprises.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { ProductsModule } from './modules/products/products.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: envs.rateLimitTtl,
          limit: envs.rateLimitLimit,
        },
      ],
    }),
    NatsModule,
    AuthModule,
    AnalyzeModule,
    SuppliersModule,
    EnterprisesModule,
    ProductsModule,
    HealthCheckModule,
  ],
})
export class AppModule {}
