import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/** Route is reachable without a token; if a valid token IS present, req.user is still populated. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
