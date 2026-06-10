/**
 * Fail-fast environment validation. In production a missing or weak secret
 * must crash the boot — never fall back to a known dev default.
 */
const REQUIRED_IN_PROD = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'WEB_ORIGIN',
  'ADMIN_ORIGIN',
] as const;

export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  if (config.NODE_ENV !== 'production') return config;

  const missing = REQUIRED_IN_PROD.filter((k) => !config[k]);
  if (missing.length > 0)
    throw new Error(
      `Production boot aborted — missing required env vars: ${missing.join(', ')}`,
    );

  const weak = (['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'] as const).filter(
    (k) => {
      const v = String(config[k]);
      return v.length < 32 || v.includes('change-me') || v.includes('secret');
    },
  );
  if (weak.length > 0)
    throw new Error(
      `Production boot aborted — weak JWT secrets (${weak.join(', ')}). ` +
        'Generate strong ones: openssl rand -hex 32',
    );

  return config;
}
