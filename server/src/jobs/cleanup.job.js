import fs from 'fs';
import path from 'path';
import { prisma } from '../prisma.js';

/**
 * Scheduled cleanup job:
 * 1. Purges soft-deleted media older than 30 days:
 *    - Deletes the physical file from disk FIRST.
 *    - Removes the database record ONLY upon confirmed file removal.
 *    - Logs errors without swallowing them.
 * 2. Purges expired/revoked RefreshTokens and expired/used PasswordResetTokens.
 */
export const runMaintenanceCleanup = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const now = new Date();

  console.log(`[Maintenance Job] Running cleanup at ${now.toISOString()}...`);

  // 1. Media Cleanup
  try {
    const expiredMedia = await prisma.media.findMany({
      where: {
        deletedAt: {
          not: null,
          lte: thirtyDaysAgo
        }
      }
    });

    console.log(`[Maintenance Job] Found ${expiredMedia.length} media records eligible for physical purge.`);

    for (const item of expiredMedia) {
      try {
        const relativePath = item.fileUrl.startsWith('/') ? item.fileUrl.slice(1) : item.fileUrl;
        const fullPath = path.join(process.cwd(), relativePath);

        // Remove physical file from disk if it exists
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
          console.log(`[Maintenance Job] Successfully deleted physical file: ${fullPath}`);
        } else {
          console.warn(`[Maintenance Job] Physical file not found on disk, proceeding with DB purge: ${fullPath}`);
        }

        // Only delete DB row if file unlinking succeeded
        await prisma.media.delete({ where: { id: item.id } });
      } catch (fileErr) {
        console.error(`[Maintenance Job ERROR] Failed to purge media item ID ${item.id} (${item.fileUrl}):`, fileErr.message);
      }
    }
  } catch (err) {
    console.error('[Maintenance Job ERROR] Media cleanup batch failed:', err.message);
  }

  // 2. Refresh Token Cleanup (Purge expired or revoked tokens older than 24h)
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deletedTokens = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lte: now } },
          { revoked: true, createdAt: { lte: oneDayAgo } }
        ]
      }
    });
    console.log(`[Maintenance Job] Purged ${deletedTokens.count} expired/revoked refresh tokens.`);
  } catch (err) {
    console.error('[Maintenance Job ERROR] Refresh token cleanup failed:', err.message);
  }

  // 3. Password Reset Token Cleanup (Purge used or expired tokens)
  try {
    const deletedResetTokens = await prisma.passwordResetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lte: now } },
          { used: true }
        ]
      }
    });
    console.log(`[Maintenance Job] Purged ${deletedResetTokens.count} used/expired password reset tokens.`);
  } catch (err) {
    console.error('[Maintenance Job ERROR] Password reset token cleanup failed:', err.message);
  }
};
