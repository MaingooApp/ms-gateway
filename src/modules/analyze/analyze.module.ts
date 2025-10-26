import { Module } from '@nestjs/common';

import { NatsModule } from 'src/transports/nats.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';

@Module({
  imports: [NatsModule, AuthModule],
  controllers: [AnalyzeController],
  providers: [AnalyzeService]
})
export class AnalyzeModule {}
