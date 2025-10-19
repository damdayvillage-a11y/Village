/**
 * Storage Configuration
 * Manages file storage providers and settings for media uploads
 */

export interface StorageProvider {
  uploadDir?: string;
  maxSize: number;
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
  bucket?: string;
  region?: string;
}

export interface StorageConfig {
  providers: {
    local: StorageProvider;
    cloudinary?: StorageProvider;
    s3?: StorageProvider;
  };
  allowedTypes: string[];
  maxFileSize: number;
  imageOptimization: {
    quality: number;
    formats: string[];
    sizes: number[];
  };
}

export const storageConfig: StorageConfig = {
  providers: {
    local: {
      uploadDir: '/public/uploads',
      maxSize: 10 * 1024 * 1024, // 10MB
    },
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME
      ? {
          maxSize: 10 * 1024 * 1024,
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.CLOUDINARY_API_KEY,
          apiSecret: process.env.CLOUDINARY_API_SECRET,
        }
      : undefined,
    s3: process.env.AWS_S3_BUCKET
      ? {
          maxSize: 10 * 1024 * 1024,
          bucket: process.env.AWS_S3_BUCKET,
          region: process.env.AWS_REGION || 'us-east-1',
        }
      : undefined,
  },
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  imageOptimization: {
    quality: 80,
    formats: ['webp', 'jpeg'],
    sizes: [320, 640, 1024, 1920], // Responsive image sizes
  },
};

/**
 * Validate file type
 */
export function isAllowedFileType(mimeType: string): boolean {
  return storageConfig.allowedTypes.includes(mimeType);
}

/**
 * Validate file size
 */
export function isAllowedFileSize(size: number): boolean {
  return size <= storageConfig.maxFileSize;
}

/**
 * Get file type category
 */
export function getFileCategory(mimeType: string): 'image' | 'video' | 'document' | 'other' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('word') ||
    mimeType.includes('excel') ||
    mimeType.includes('powerpoint')
  ) {
    return 'document';
  }
  return 'other';
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const ext = safeName.split('.').pop();
  const nameWithoutExt = safeName.substring(0, safeName.lastIndexOf('.'));
  return `${timestamp}-${random}-${nameWithoutExt}.${ext}`;
}
