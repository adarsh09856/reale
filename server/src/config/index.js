import dotenv from 'dotenv';
dotenv.config();

// Fail-Fast: Validate required core secrets
const CORE_REQUIRED_SECRETS = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'IP_HASH_SALT'];
for (const secret of CORE_REQUIRED_SECRETS) {
  if (!process.env[secret] || process.env[secret].trim() === '') {
    throw new Error(`CRITICAL SECURITY FAILURE: Missing required environment variable '${secret}'. Application startup aborted.`);
  }
}

// In production, enforce database URL and SMTP credentials
if (process.env.NODE_ENV === 'production') {
  const PROD_REQUIRED = ['DATABASE_URL', 'SMTP_USER', 'SMTP_PASS'];
  for (const item of PROD_REQUIRED) {
    if (!process.env[item] || process.env[item].trim() === '') {
      throw new Error(`PRODUCTION BOOTSTRAP FAILURE: Missing required production config '${item}'. Application startup aborted.`);
    }
  }
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  ipHashSalt: process.env.IP_HASH_SALT,
  jwtAccessExpiry: '15m',
  jwtRefreshExpiryDays: 7,
  corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://127.0.0.1:3000').split(','),
  aiApiKey: process.env.AI_API_KEY || '',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@jigme.bt'
  }
};
