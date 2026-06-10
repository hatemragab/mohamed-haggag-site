import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import {
  CurrentUser,
  JwtUser,
} from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { AdminLoginDto, LoginDto, RegisterDto } from './dto/auth.dto';

/**
 * Credential endpoints are rate-limited per IP (brute-force protection).
 * /me and /logout are exempt — they fire on normal page loads.
 */
@ApiTags('auth')
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('register')
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.register(dto, res);
  }

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.auth.login(dto, res);
  }

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('admin/login')
  adminLogin(
    @Body() dto: AdminLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.adminLogin(dto, res);
  }

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = (req.cookies as Record<string, string> | undefined)?.[
      'refresh_token'
    ];
    return this.auth.refresh(token, res);
  }

  @Public()
  @SkipThrottle()
  @Post('logout')
  logout(
    @CurrentUser() user: JwtUser | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.logout(user?.sub, res);
  }

  /**
   * Public on purpose: anonymous visitors get 200 + {user:null} instead of a
   * 401 (a 401 here would print a console error on every page load).
   */
  @Public()
  @SkipThrottle()
  @Get('me')
  async me(@CurrentUser() user: JwtUser | undefined) {
    return { user: user ? await this.auth.me(user.sub) : null };
  }
}
