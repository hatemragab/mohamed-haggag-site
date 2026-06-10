import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Connection, ConnectionStates } from 'mongoose';
import { Public } from '../common/decorators/public.decorator';

/** Root banner + liveness/readiness probe for load balancers and monitors. */
@ApiTags('health')
@Controller()
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  /** Friendly landing for GET / — confirms the API is alive and points around. */
  @Public()
  @Get()
  root() {
    return {
      name: 'Haggag Academy API',
      service: 'منصة الأستاذ محمد حجاج التعليمية — REST API',
      status: 'ok',
      health: '/health',
      ...(process.env.SWAGGER_ENABLED !== 'false' ? { docs: '/docs' } : {}),
    };
  }

  @Public()
  @Get('health')
  check() {
    const dbUp = this.connection.readyState === ConnectionStates.connected;
    return {
      status: dbUp ? 'ok' : 'degraded',
      db: dbUp ? 'up' : 'down',
      uptime: Math.round(process.uptime()),
    };
  }
}
