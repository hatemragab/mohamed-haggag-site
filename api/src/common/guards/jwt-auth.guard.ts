import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { MK } from '../../i18n/messages';
import { JwtUser } from '../decorators/current-user.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Global guard: every route requires a valid access token unless marked @Public().
 * Public routes still get req.user populated when a valid token is present,
 * which lets endpoints like the lesson catalog adapt to logged-in users.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtUser }>();
    const token = (req.cookies as Record<string, string> | undefined)?.[
      'access_token'
    ];

    if (token) {
      try {
        req.user = await this.jwt.verifyAsync<JwtUser>(token, {
          secret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
        });
      } catch {
        if (!isPublic) throw new UnauthorizedException(MK.sessionExpired);
      }
    }
    if (!req.user && !isPublic)
      throw new UnauthorizedException(MK.loginRequired);
    return true;
  }
}
