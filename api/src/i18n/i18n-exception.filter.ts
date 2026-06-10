import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Locale, resolveLocale, translate } from './messages';

/**
 * Catches every HttpException, resolves the request locale (explicit ?lang →
 * Accept-Language → mh_locale cookie → default ar), and replaces any message
 * KEY in the response with its localized text. The standard Nest error shape
 * (`{ statusCode, message, error }`) is preserved so clients keep reading
 * `body.message` exactly as before.
 */
@Catch(HttpException)
export class I18nExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const locale = this.localeOf(req);
    const payload = exception.getResponse();

    if (typeof payload === 'string') {
      res.status(status).json({
        statusCode: status,
        message: translate(payload, locale),
      });
      return;
    }

    const body = payload as { message?: string | string[] } & Record<
      string,
      unknown
    >;
    const message = body.message;
    const localized = Array.isArray(message)
      ? message.map((m) => translate(m, locale))
      : typeof message === 'string'
        ? translate(message, locale)
        : message;

    res.status(status).json({ ...body, message: localized });
  }

  private localeOf(req: Request): Locale {
    const lang = (req.query as Record<string, unknown>).lang;
    const header = req.headers['accept-language'];
    const cookieMatch = /(?:^|;\s*)mh_locale=([^;]+)/.exec(
      req.headers.cookie ?? '',
    );
    const candidate =
      (typeof lang === 'string' ? lang : undefined) ??
      (typeof header === 'string' ? header : undefined) ??
      cookieMatch?.[1];
    return resolveLocale(candidate);
  }
}
