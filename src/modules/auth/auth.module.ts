import { Module } from '@nestjs/common';

import { NatsModule } from 'src/transports/nats.module';
import { AuthGuard } from 'src/common/guards';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [NatsModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard]
})
export class AuthModule {}
