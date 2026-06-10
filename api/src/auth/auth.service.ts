import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { JwtUser } from '../common/decorators/current-user.decorator';
import { MK } from '../i18n/messages';
import { UserDocument } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { AdminLoginDto, LoginDto, RegisterDto } from './dto/auth.dto';

const ACCESS_TTL_MS = 15 * 60 * 1000;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  private payload(user: UserDocument): JwtUser {
    return {
      sub: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    };
  }

  private async issueTokens(user: UserDocument, res: Response) {
    const payload = this.payload(user);
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
      expiresIn: '15m',
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
      expiresIn: '7d',
    });
    await this.users.setRefreshTokenHash(
      payload.sub,
      await bcrypt.hash(refreshToken, 10),
    );
    const secure = process.env.COOKIE_SECURE === 'true';
    // 'lax' works when web/admin/api share a registrable domain;
    // set COOKIE_SAMESITE=none (+ COOKIE_SECURE=true) for cross-domain setups.
    const sameSiteEnv = process.env.COOKIE_SAMESITE;
    const sameSite: 'lax' | 'strict' | 'none' =
      sameSiteEnv === 'none' || sameSiteEnv === 'strict' ? sameSiteEnv : 'lax';
    const base = { httpOnly: true, sameSite, secure, path: '/' };
    res.cookie('access_token', accessToken, { ...base, maxAge: ACCESS_TTL_MS });
    res.cookie('refresh_token', refreshToken, {
      ...base,
      maxAge: REFRESH_TTL_MS,
    });
    return this.publicUser(user);
  }

  publicUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      role: user.role,
      unlockedAll: user.unlockedAll,
      unlockedCategories: user.unlockedCategories.map((c) => c.toString()),
    };
  }

  async register(dto: RegisterDto, res: Response) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new ConflictException(MK.emailTaken);
    const user = await this.users.create({
      name: dto.name.trim(),
      email: dto.email.toLowerCase(),
      phone: dto.phone?.trim() || undefined,
      passwordHash: await bcrypt.hash(dto.password, 10),
      role: 'student',
    });
    return this.issueTokens(user, res);
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash)))
      throw new UnauthorizedException(MK.invalidCredentials);
    if (user.status === 'suspended')
      throw new ForbiddenException(MK.accountSuspended);
    return this.issueTokens(user, res);
  }

  async adminLogin(dto: AdminLoginDto, res: Response) {
    const user = await this.users.findByEmailOrUsername(dto.identifier);
    if (
      !user ||
      user.role !== 'admin' ||
      !(await bcrypt.compare(dto.password, user.passwordHash))
    )
      throw new UnauthorizedException(MK.invalidAdminCredentials);
    return this.issueTokens(user, res);
  }

  async refresh(token: string | undefined, res: Response) {
    if (!token) throw new UnauthorizedException(MK.noSession);
    let payload: JwtUser;
    try {
      payload = await this.jwt.verifyAsync<JwtUser>(token, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
      });
    } catch {
      throw new UnauthorizedException(MK.sessionExpired);
    }
    const user = await this.users.findById(payload.sub);
    if (
      !user.refreshTokenHash ||
      !(await bcrypt.compare(token, user.refreshTokenHash))
    )
      throw new UnauthorizedException(MK.sessionExpired);
    if (user.status === 'suspended')
      throw new ForbiddenException(MK.accountSuspended);
    return this.issueTokens(user, res);
  }

  async logout(userId: string | undefined, res: Response) {
    if (userId) await this.users.setRefreshTokenHash(userId, null);
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return { ok: true };
  }

  async me(userId: string) {
    return this.publicUser(await this.users.findById(userId));
  }
}
