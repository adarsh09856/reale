import crypto from 'crypto';
import { config } from '../config/index.js';
import { prisma } from '../prisma.js';

// Common bots to exclude from analytics
const BOT_USER_AGENTS = [
  'bot', 'crawl', 'spider', 'slurp', 'mediapartners', 'uptime', 'healthcheck', 'lighthouse', 'curl', 'postman'
];

export const visitorTracker = async (req, res, next) => {
  // Only track GET requests on non-health and non-static asset routes
  if (req.method !== 'GET') return next();
  
  const path = req.path;
  if (
    path.startsWith('/api/v1/health') ||
    path.startsWith('/uploads') ||
    path.startsWith('/favicon') ||
    path.endsWith('.js') ||
    path.endsWith('.css') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.webp')
  ) {
    return next();
  }

  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));
  if (isBot) {
    return next();
  }

  // Anonymize IP using SHA-256 with the configured central salt
  const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const ipHash = crypto
    .createHash('sha256')
    .update(`${clientIp}-${config.ipHashSalt}`)
    .digest('hex');

  // Insert visitor log asynchronously (non-blocking)
  prisma.visitorLog.create({
    data: {
      ipHash,
      path
    }
  }).catch(err => {
    // Non-fatal logging
    console.error('[Visitor Tracker] Failed to record visit:', err.message);
  });

  next();
};
