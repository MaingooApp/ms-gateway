import { Module } from '@nestjs/common';

import { EnterprisesController } from './enterprises.controller';
import { EnterprisesService } from './enterprises.service';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [EnterprisesController],
  providers: [EnterprisesService],
})
export class EnterprisesModule {}
