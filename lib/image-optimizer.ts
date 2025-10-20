/**
 * Image Optimization Utility
 * Handles image compression, format conversion, and responsive image generation
 */

import sharp from 'sharp';
import { createHash } from 'crypto';

export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  withoutEnlargement?: boolean;
}

export interface OptimizedImage {
  buffer: Buffer;
  info: {
    format: string;
    width: number;
    height: number;
    size: number;
  };
}

export interface ImageVariants {
  thumbnail: OptimizedImage;
  medium: OptimizedImage;
  large: OptimizedImage;
  original?: OptimizedImage;
}

/**
 * Quality presets for different image sizes
 */
export const QUALITY_PRESETS = {
  thumbnail: 60,
  medium: 75,
  large: 85,
  original: 90,
} as const;

/**
 * Dimension presets for responsive images
 */
export const DIMENSION_PRESETS = {
  thumbnail: { width: 150, height: 150 },
  medium: { width: 800, height: 600 },
  large: { width: 1920, height: 1080 },
} as const;

/**
 * Optimize a single image with specified options
 */
export async function optimizeImage(
  input: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImage> {
  const {
    quality = 80,
    format = 'webp',
    width,
    height,
    fit = 'cover',
    withoutEnlargement = true,
  } = options;

  let pipeline = sharp(input);

  // Resize if dimensions provided
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit,
      withoutEnlargement,
    });
  }

  // Convert format and apply quality
  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, progressive: true });
      break;
    case 'png':
      pipeline = pipeline.png({ quality, progressive: true });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
  }

  const buffer = await pipeline.toBuffer({ resolveWithObject: true });

  return {
    buffer: buffer.data,
    info: {
      format: buffer.info.format,
      width: buffer.info.width,
      height: buffer.info.height,
      size: buffer.info.size,
    },
  };
}

/**
 * Generate multiple image variants (thumbnail, medium, large)
 */
export async function generateImageVariants(
  input: Buffer,
  options: {
    includeOriginal?: boolean;
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
  } = {}
): Promise<ImageVariants> {
  const { includeOriginal = false, format = 'webp' } = options;

  const [thumbnail, medium, large] = await Promise.all([
    optimizeImage(input, {
      ...DIMENSION_PRESETS.thumbnail,
      quality: QUALITY_PRESETS.thumbnail,
      format,
      fit: 'cover',
    }),
    optimizeImage(input, {
      ...DIMENSION_PRESETS.medium,
      quality: QUALITY_PRESETS.medium,
      format,
      fit: 'inside',
    }),
    optimizeImage(input, {
      ...DIMENSION_PRESETS.large,
      quality: QUALITY_PRESETS.large,
      format,
      fit: 'inside',
    }),
  ]);

  const variants: ImageVariants = {
    thumbnail,
    medium,
    large,
  };

  if (includeOriginal) {
    variants.original = await optimizeImage(input, {
      quality: QUALITY_PRESETS.original,
      format,
    });
  }

  return variants;
}

/**
 * Extract metadata from image
 */
export async function getImageMetadata(input: Buffer) {
  const metadata = await sharp(input).metadata();

  return {
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    space: metadata.space,
    channels: metadata.channels,
    depth: metadata.depth,
    density: metadata.density,
    hasAlpha: metadata.hasAlpha,
    orientation: metadata.orientation,
  };
}

/**
 * Generate a hash for image content (for deduplication)
 */
export function generateImageHash(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

/**
 * Validate image file size and dimensions
 */
export async function validateImage(
  buffer: Buffer,
  options: {
    maxSizeMB?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): Promise<{ valid: boolean; error?: string }> {
  const { maxSizeMB = 10, maxWidth = 5000, maxHeight = 5000 } = options;

  // Check file size
  const sizeMB = buffer.length / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `Image size ${sizeMB.toFixed(2)}MB exceeds maximum ${maxSizeMB}MB`,
    };
  }

  // Check dimensions
  try {
    const metadata = await getImageMetadata(buffer);

    if (metadata.width && metadata.width > maxWidth) {
      return {
        valid: false,
        error: `Image width ${metadata.width}px exceeds maximum ${maxWidth}px`,
      };
    }

    if (metadata.height && metadata.height > maxHeight) {
      return {
        valid: false,
        error: `Image height ${metadata.height}px exceeds maximum ${maxHeight}px`,
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid image file',
    };
  }
}
