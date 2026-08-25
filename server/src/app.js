import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config/index.js';
import { visitorTracker } from './middleware/visitorTracker.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import { runMaintenanceCleanup } from './jobs/cleanup.job.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import kpiRoutes from './routes/kpi.routes.js';
import propertyRoutes from './routes/property.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import loanRoutes from './routes/loan.routes.js';
import cmsRoutes from './routes/cms.routes.js';
import userRoutes from './routes/user.routes.js';
import systemRoutes from './routes/system.routes.js';
import aiRoutes from './routes/ai.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);
    if (config.corsAllowedOrigins.includes(origin) || config.nodeEnv === 'development') {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Media Uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Visitor Tracking Analytics Middleware
app.use(visitorTracker);

// Global API Rate Limiter
app.use('/api/v1', apiLimiter);

// API Route Mounts
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/kpis', kpiRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/inquiries', inquiryRoutes);
app.use('/api/v1/loan', loanRoutes);
app.use('/api/v1', cmsRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', systemRoutes);
app.use('/api/v1/ai', aiRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Schedule Maintenance Cleanup (runs every 24 hours)
setInterval(runMaintenanceCleanup, 24 * 60 * 60 * 1000);

// Only listen if not running in test runner
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`🚀 Jigme Enterprise Backend listening on port ${config.port} (${config.nodeEnv})`);
  });
}

export default app;
