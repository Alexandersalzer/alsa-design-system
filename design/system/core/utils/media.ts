/**
 * media.ts - Media utility functions
 *
 * Utilities for handling media URLs, thumbnails, video processing, and filename normalization
 *
 * @module core/utils/media
 * @since 2026-01-02
 */

/**
 * Normalizes filename to URL-safe format
 * Converts Swedish characters (å, ä, ö) and removes accents
 * This prevents Unicode vs percent-encoded mismatches in CDN URLs
 *
 * @param filename - Original filename with potential special characters
 * @returns URL-safe normalized filename
 *
 * @example
 * ```ts
 * normalizeFilename('månadsresultat.png');     // 'manadsresultat.png'
 * normalizeFilename('Björk_Café.jpg');         // 'bjork-cafe.jpg'
 * normalizeFilename('räksmörgås 2024.mp4');    // 'raksmorgas-2024.mp4'
 * ```
 */
export function normalizeFilename(filename: string): string {
  return filename
    .normalize("NFKD")              // Split accents (å → a + ˚)
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .replace(/å/gi, "a")             // Swedish å → a
    .replace(/ä/gi, "a")             // Swedish ä → a
    .replace(/ö/gi, "o")             // Swedish ö → o
    .replace(/[^a-z0-9._-]/gi, "-")  // Safe chars only
    .replace(/-+/g, "-")             // Collapse multiple dashes
    .replace(/^-|-$/g, "")           // Trim leading/trailing dashes
    .toLowerCase();
}

/**
 * Normalizes a full CDN URL path
 * Extracts filename from URL and normalizes it to prevent encoding issues
 *
 * @param url - Full CDN URL potentially containing special characters
 * @returns Normalized CDN URL with safe filename
 *
 * @example
 * ```ts
 * normalizeCdnUrl('https://cdn.blimpify-im.com/members/user-123/images/månadsresultat.png');
 * // Returns: 'https://cdn.blimpify-im.com/members/user-123/images/manadsresultat.png'
 * ```
 */
export function normalizeCdnUrl(url: string): string {
  // Already normalized or external URL - return as-is
  if (!url.includes('å') && !url.includes('ä') && !url.includes('ö') && !url.includes('%')) {
    return url;
  }

  try {
    // Decode any percent-encoded characters first
    const decodedUrl = decodeURIComponent(url);

    // Split URL into parts
    const urlParts = decodedUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    // Normalize just the filename
    const normalizedFilename = normalizeFilename(filename);

    // Rebuild URL with normalized filename
    urlParts[urlParts.length - 1] = normalizedFilename;
    return urlParts.join('/');
  } catch (error) {
    console.warn('Failed to normalize CDN URL:', url, error);
    return url;
  }
}

/**
 * Derive thumbnail URL from video URL using consistent naming convention
 * Also normalizes the filename to prevent URL encoding issues
 *
 * Videos are stored at:    cdn.blimpify-im.com/members/2194716412/videos/swaelee.mp4
 * Thumbnails are stored at: cdn.blimpify-im.com/members/2194716412/thumbnails/swaelee.jpg
 *
 * This function transforms the video URL to the thumbnail URL by:
 * 1. Normalizing the video URL (å/ä/ö → a/a/o)
 * 2. Replacing '/videos/' with '/thumbnails/'
 * 3. Replacing the video extension (.mp4, .webm, .mov, etc.) with .jpg
 *
 * @param videoUrl - Full video URL or S3 key
 * @returns Derived thumbnail URL, or undefined if not a valid video URL
 *
 * @example
 * ```ts
 * const videoUrl = 'https://cdn.blimpify-im.com/members/2194716412/videos/månadsvideo.mp4';
 * const thumbnailUrl = getVideoThumbnailUrl(videoUrl);
 * // Returns: 'https://cdn.blimpify-im.com/members/2194716412/thumbnails/manadsvideo.jpg'
 * ```
 */
export function getVideoThumbnailUrl(videoUrl: string | undefined): string | undefined {
  if (!videoUrl) return undefined;

  // Check if URL contains /videos/ path
  if (!videoUrl.includes('/videos/')) return undefined;

  // Normalize the URL first to handle Swedish characters
  const normalizedUrl = normalizeCdnUrl(videoUrl);

  // Replace /videos/ with /thumbnails/ and change extension to .jpg
  return normalizedUrl
    .replace('/videos/', '/thumbnails/')
    .replace(/\.(mp4|webm|mov|avi|mkv)$/i, '.jpg');
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
