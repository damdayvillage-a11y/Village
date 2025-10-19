/**
 * Image Processing Utilities
 * Handles image optimization, resizing, and thumbnail generation using Sharp
 */

import sharp from 'sharp';
import { storageConfig } from './storage-config';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

export interface ImageProcessingResult {
  optimized: string; // Path to optimized image
  thumbnail: string; // Path to thumbnail
  width: number;
  height: number;
  size: number; // File size in bytes
}

export interface ProcessImageOptions {
  buffer: Buffer;
  filename: string;
  uploadDir: string;
  generateThumbnail?: boolean;
  quality?: number;
}

/**
 * Process and optimize an image
 */
export async function processImage(
  options: ProcessImageOptions
): Promise<ImageProcessingResult> {
  const {
    buffer,
    filename,
    uploadDir,
    generateThumbnail = true,
    quality = storageConfig.imageOptimization.quality,
  } = options;

  // Ensure upload directory exists
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Get image metadata
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // Optimize the main image
  const optimizedPath = join(uploadDir, filename);
  const optimizedBuffer = await image
    .resize(1920, 1920, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer();

  await writeFile(optimizedPath.replace(/\.[^.]+$/, '.webp'), optimizedBuffer);

  // Generate thumbnail if requested
  let thumbnailPath = '';
  if (generateThumbnail) {
    const thumbnailFilename = `thumb_${filename}`.replace(/\.[^.]+$/, '.webp');
    thumbnailPath = join(uploadDir, thumbnailFilename);
    
    await sharp(buffer)
      .resize(320, 320, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 70 })
      .toFile(thumbnailPath);
  }

  return {
    optimized: optimizedPath.replace(/\.[^.]+$/, '.webp'),
    thumbnail: thumbnailPath,
    width,
    height,
    size: optimizedBuffer.length,
  };
}

/**
 * Generate responsive image sizes
 */
export async function generateResponsiveImages(
  buffer: Buffer,
  filename: string,
  uploadDir: string
): Promise<{ [size: number]: string }> {
  const sizes = storageConfig.imageOptimization.sizes;
  const responsive: { [size: number]: string } = {};

  for (const size of sizes) {
    const responsiveFilename = `${filename.replace(/\.[^.]+$/, '')}_${size}w.webp`;
    const responsivePath = join(uploadDir, responsiveFilename);

    await sharp(buffer)
      .resize(size, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: storageConfig.imageOptimization.quality })
      .toFile(responsivePath);

    responsive[size] = responsivePath;
  }

  return responsive;
}

/**
 * Extract image dominant color
 */
export async function getImageDominantColor(buffer: Buffer): Promise<string> {
  const { dominant } = await sharp(buffer).stats();
  const { r, g, b } = dominant;
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Validate if buffer is a valid image
 */
export async function isValidImage(buffer: Buffer): Promise<boolean> {
  try {
    const metadata = await sharp(buffer).metadata();
    return !!metadata.format;
  } catch (error) {
    return false;
  }
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}

/**
 * Calculate file checksum (SHA-256)
 */
export async function calculateChecksum(buffer: Buffer): Promise<string> {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
