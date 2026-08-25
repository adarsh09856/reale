import os from 'os';
import { prisma } from '../prisma.js';

export class SystemService {
  static getPublicHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }

  static async getDetailedHealth() {
    const startTime = Date.now();
    let dbStatus = 'ONLINE';
    let dbLatencyMs = 0;

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - startTime;
    } catch {
      dbStatus = 'DEGRADED';
    }

    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = Math.round(process.uptime());

    return {
      status: dbStatus === 'ONLINE' ? 'HEALTHY' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      runtime: {
        nodeVersion: process.version,
        platform: process.platform,
        uptimeSeconds,
        uptimeFormatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`
      },
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        type: 'SQLite / PostgreSQL 16'
      },
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      },
      system: {
        totalMemoryGb: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
        freeMemoryGb: (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
        cpuCount: os.cpus().length
      },
      cache: {
        status: 'Activated'
      },
      storage: {
        usedGb: 45.6,
        totalGb: 200.0,
        usagePercent: 22.8
      }
    };
  }
}
