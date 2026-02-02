// ===============================================
// design/system/core/utils/upload.ts
// UPLOAD UTILITIES - Filename normalization for S3/CDN uploads
// ===============================================

import { normalizeFilename } from './media';

/**
 * Prepare file for upload to S3/CDN
 * Normalizes filename to prevent URL encoding issues
 *
 * @param file - Original file object
 * @param userId - User ID for path construction
 * @param mediaType - Type of media (images, videos, documents, etc.)
 * @returns Normalized S3 key and safe filename
 *
 * @example
 * ```ts
 * const file = new File([blob], 'månadsresultat.png', { type: 'image/png' });
 * const uploadInfo = prepareFileUpload(file, 'user-123', 'images');
 * // Returns:
 * // {
 * //   s3Key: 'members/user-123/images/manadsresultat.png',
 * //   safeFilename: 'manadsresultat.png',
 * //   originalFilename: 'månadsresultat.png',
 * //   contentType: 'image/png'
 * // }
 * ```
 */
export interface PreparedUpload {
  /** S3 key (full path in bucket) */
  s3Key: string;
  /** URL-safe normalized filename */
  safeFilename: string;
  /** Original filename (for reference/metadata) */
  originalFilename: string;
  /** MIME type */
  contentType: string;
}

export function prepareFileUpload(
  file: File,
  userId: string,
  mediaType: 'images' | 'videos' | 'thumbnails' | 'documents' = 'images'
): PreparedUpload {
  const originalFilename = file.name;
  const safeFilename = normalizeFilename(originalFilename);
  const s3Key = `members/${userId}/${mediaType}/${safeFilename}`;

  return {
    s3Key,
    safeFilename,
    originalFilename,
    contentType: file.type
  };
}

/**
 * Generate thumbnail S3 key from video S3 key
 * Converts: members/user-123/videos/video.mp4 → members/user-123/thumbnails/video.jpg
 *
 * @param videoS3Key - Original video S3 key
 * @returns Thumbnail S3 key
 *
 * @example
 * ```ts
 * const videoKey = 'members/user-123/videos/månadsvideo.mp4';
 * const thumbKey = generateThumbnailKey(videoKey);
 * // Returns: 'members/user-123/thumbnails/manadsvideo.jpg'
 * ```
 */
export function generateThumbnailKey(videoS3Key: string): string {
  return videoS3Key
    .replace('/videos/', '/thumbnails/')
    .replace(/\.(mp4|webm|mov|avi|mkv)$/i, '.jpg');
}

/**
 * Example Next.js API route for file upload with normalization
 *
 * @example
 * ```ts
 * // app/api/upload/route.ts
 * import { prepareFileUpload } from '@blimpify-ui/design/system/core/utils/upload';
 * import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
 *
 * export async function POST(request: Request) {
 *   const formData = await request.formData();
 *   const file = formData.get('file') as File;
 *   const userId = formData.get('userId') as string;
 *
 *   // Normalize filename before upload
 *   const upload = prepareFileUpload(file, userId, 'images');
 *
 *   // Upload to S3 with normalized key
 *   const s3Client = new S3Client({ region: 'eu-north-1' });
 *   await s3Client.send(new PutObjectCommand({
 *     Bucket: process.env.S3_BUCKET_NAME,
 *     Key: upload.s3Key,  // <- Normalized key
 *     Body: Buffer.from(await file.arrayBuffer()),
 *     ContentType: upload.contentType,
 *     Metadata: {
 *       originalFilename: upload.originalFilename
 *     }
 *   }));
 *
 *   // Return CDN URL with normalized filename
 *   return Response.json({
 *     url: `https://cdn.blimpify-im.com/${upload.s3Key}`,
 *     filename: upload.safeFilename
 *   });
 * }
 * ```
 */

/**
 * Validate file type and size
 *
 * @param file - File to validate
 * @param options - Validation options
 * @returns Validation result
 *
 * @example
 * ```ts
 * const result = validateFile(file, {
 *   allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
 *   maxSizeMB: 10
 * });
 *
 * if (!result.valid) {
 *   throw new Error(result.error);
 * }
 * ```
 */
export interface FileValidationOptions {
  /** Allowed MIME types */
  allowedTypes?: string[];
  /** Max file size in megabytes */
  maxSizeMB?: number;
  /** Min file size in megabytes */
  minSizeMB?: number;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const {
    allowedTypes,
    maxSizeMB = 100,
    minSizeMB = 0
  } = options;

  // Check file type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
    };
  }

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File too large. Max size: ${maxSizeMB}MB`
    };
  }

  if (fileSizeMB < minSizeMB) {
    return {
      valid: false,
      error: `File too small. Min size: ${minSizeMB}MB`
    };
  }

  return { valid: true };
}

/**
 * Common file type presets
 */
export const FILE_TYPE_PRESETS = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  videos: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg']
} as const;
