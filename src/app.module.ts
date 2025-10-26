import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { envs } from './config';
import { RpcToHttpExceptionFilter } from './common';
import { NatsModule } from './transports/nats.module';
import { AuthModule } from './modules/auth/auth.module';
import { AnalyzeModule } from './modules/analyze/analyze.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { EnterprisesModule } from './modules/enterprises/enterprises.module';

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
    HealthCheckModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: RpcToHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
