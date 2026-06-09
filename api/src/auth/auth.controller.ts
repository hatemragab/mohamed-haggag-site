import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  CurrentUser,
  JwtUser,
} from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { AdminLoginDto, LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.register(dto, res);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.auth.login(dto, res);
  }

  @Public()
  @Post('admin/login')
  adminLogin(
    @Body() dto: AdminLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.adminLogin(dto, res);
  }

  @Public()
  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = (req.cookies as Record<string, string> | undefined)?.[
      'refresh_token'
    ];
    return this.auth.refresh(token, res);
  }

  @Public()
  @Post('logout')
  logout(
    @CurrentUser() user: JwtUser | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.logout(user?.sub, res);
  }

  @Get('me')
  me(@CurrentUser() user: JwtUser) {
    return this.auth.me(user.sub);
  }
}
