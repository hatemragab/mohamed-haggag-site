import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../users/user.schema';

export interface JwtUser {
  sub: string;
  role: UserRole;
  name: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtUser | undefined => {
    const req = ctx.switchToHttp().getRequest<{ user?: JwtUser }>();
    return req.user;
  },
);
