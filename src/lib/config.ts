const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined || value === null) {
    return fallback;
  }
  const normalized = value.toString().toLowerCase().trim();
  if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  return fallback;
};

export const config = {
  JWT_SECRET: process.env.JWT_SECRET ?? 'your-super-secret-jwt-key-change-this-in-production',
  DATABASE: {
    host: process.env.DB_HOST ?? 'localhost',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'sports_store',
    port: parseNumber(process.env.DB_PORT, 3306),
  },
  EMAIL: {
    SMTP_HOST: process.env.SMTP_HOST ?? '',
    SMTP_PORT: parseNumber(process.env.SMTP_PORT, 587),
    SMTP_SECURE: parseBoolean(process.env.SMTP_SECURE, false),
    SMTP_USER: process.env.SMTP_USER ?? '',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD ?? '',
    FROM: process.env.MAIL_FROM ?? 'SportStore <no-reply@sportstore.local>',
    ENABLED: Boolean(
      (process.env.SMTP_HOST ?? '').trim() &&
      (process.env.SMTP_USER ?? '').trim() &&
      (process.env.SMTP_PASSWORD ?? '').trim()
    )
  }
};
