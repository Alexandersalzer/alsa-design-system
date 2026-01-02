/**
 * media.ts - Media utility functions
 *
 * Utilities for handling media URLs, thumbnails, and video processing
 *
 * @module core/utils/media
 * @since 2026-01-02
 */

/**
 * Derive thumbnail URL from video URL using consistent naming convention
 *
 * Videos are stored at:    user-{id}/videos/vid-{username}-{id}.mp4
 * Thumbnails are stored at: user-{id}/thumbnails/vid-{username}-{id}.jpg
 *
 * This function transforms the video URL to the thumbnail URL by:
 * 1. Replacing '/videos/' with '/thumbnails/'
 * 2. Replacing the video extension (.mp4, .webm, etc.) with .jpg
 *
 * @param videoUrl - Full video URL or S3 key
 * @returns Derived thumbnail URL, or undefined if not a valid video URL
 *
 * @example
 * ```ts
 * const videoUrl = 'https://cdn.example.com/user-123/videos/vid-kjmarketing-456789.mp4';
 * const thumbnailUrl = getVideoThumbnailUrl(videoUrl);
 * // Returns: 'https://cdn.example.com/user-123/thumbnails/vid-kjmarketing-456789.jpg'
 * ```
 */
export function getVideoThumbnailUrl(videoUrl: string | undefined): string | undefined {
  if (!videoUrl) return undefined;

  // Check if URL contains /videos/ path
  if (!videoUrl.includes('/videos/')) return undefined;

  // Replace /videos/ with /thumbnails/ and change extension to .jpg
  return videoUrl
    .replace('/videos/', '/thumbnails/')
    .replace(/\.(mp4|webm|mov|avi|mkv)$/i, '.jpg');
}

/**
 * Check if URL is a video file based on extension
 *
 * @param url - URL or file path to check
 * @returns True if URL ends with video extension
 *
 * @example
 * ```ts
 * isVideoUrl('video.mp4'); // true
 * isVideoUrl('image.jpg'); // false
 * ```
 */
export function isVideoUrl(url: string | undefined): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|avi|mkv)$/i.test(url);
}

/**
 * Check if URL is an image file based on extension
 *
 * @param url - URL or file path to check
 * @returns True if URL ends with image extension
 *
 * @example
 * ```ts
 * isImageUrl('photo.jpg'); // true
 * isImageUrl('video.mp4'); // false
 * ```
 */
export function isImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}

/**
 * Get media type from URL
 *
 * @param url - URL or file path
 * @returns 'video', 'image', or 'unknown'
 *
 * @example
 * ```ts
 * getMediaType('photo.jpg');  // 'image'
 * getMediaType('video.mp4');  // 'video'
 * getMediaType('document.pdf'); // 'unknown'
 * ```
 */
export function getMediaType(url: string | undefined): 'video' | 'image' | 'unknown' {
  if (isVideoUrl(url)) return 'video';
  if (isImageUrl(url)) return 'image';
  return 'unknown';
}

/**
 * Format file size in bytes to human-readable format
 *
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 *
 * @example
 * ```ts
 * formatFileSize(1024);        // '1.00 KB'
 * formatFileSize(1048576);     // '1.00 MB'
 * formatFileSize(1073741824);  // '1.00 GB'
 * ```
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Extract filename from URL or path
 *
 * @param url - URL or file path
 * @returns Filename without path
 *
 * @example
 * ```ts
 * getFilename('https://cdn.example.com/user-123/videos/video.mp4'); // 'video.mp4'
 * getFilename('/path/to/file.jpg'); // 'file.jpg'
 * ```
 */
export function getFilename(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.split('/').pop();
}

/**
 * Extract file extension from URL or filename
 *
 * @param url - URL or filename
 * @returns File extension (without dot), or undefined
 *
 * @example
 * ```ts
 * getFileExtension('video.mp4');     // 'mp4'
 * getFileExtension('image.jpg');     // 'jpg'
 * getFileExtension('no-extension');  // undefined
 * ```
 */
export function getFileExtension(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const filename = getFilename(url);
  if (!filename) return undefined;

  const parts = filename.split('.');
  if (parts.length < 2) return undefined;

  return parts.pop()?.toLowerCase();
}
