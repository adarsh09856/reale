import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// In-memory storage for inspection before disk save
const storage = multer.memoryStorage();

// Allowed MIME types
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'));
    }
    cb(null, true);
  }
});

// Hardened image processing: Sniffs buffer, strips EXIF, re-encodes to clean WebP
export const processAndSaveImage = async (buffer, originalName) => {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.format || !['jpeg', 'png', 'webp', 'gif'].includes(metadata.format)) {
    throw new Error('File content does not match a valid image format.');
  }

  // Create date-based directory: uploads/YYYY/MM
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const uploadDir = path.join(process.cwd(), 'uploads', year, month);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const randomId = crypto.randomBytes(16).toString('hex');
  const fileName = `${randomId}.webp`;
  const filePath = path.join(uploadDir, fileName);

  // Re-encode to clean WebP, stripping all EXIF and malicious polyglot payloads
  const processedBuffer = await image
    .rotate()
    .webp({ quality: 85 })
    .toBuffer();

  await fs.promises.writeFile(filePath, processedBuffer);

  const fileUrl = `/uploads/${year}/${month}/${fileName}`;

  return {
    fileName: originalName,
    fileUrl,
    mimeType: 'image/webp',
    sizeBytes: processedBuffer.length
  };
};
