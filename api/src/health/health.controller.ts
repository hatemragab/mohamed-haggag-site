import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Connection, ConnectionStates } from 'mongoose';
import { Public } from '../common/decorators/public.decorator';

/** Liveness/readiness probe for load balancers and uptime monitors. */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Public()
  @Get()
  check() {
    const dbUp = this.connection.readyState === ConnectionStates.connected;
    return {
      status: dbUp ? 'ok' : 'degraded',
      db: dbUp ? 'up' : 'down',
      uptime: Math.round(process.uptime()),
    };
  }
}
