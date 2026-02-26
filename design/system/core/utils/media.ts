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
 * Videos are stored at:    cdn.blimpify-im.com/members/2194716412/videos/swaelee.mp4
 * Thumbnails are stored at: cdn.blimpify-im.com/members/2194716412/thumbnails/swaelee.jpg
 *
 * This function transforms the video URL to the thumbnail URL by:
 * 1. Replacing '/videos/' with '/thumbnails/' (or /media/ -> /thumbnails/ som fallback)
 * 2. Replacing the video extension (.mp4, .webm, .mov, etc.) with .jpg
 *
 * Stöder både full CDN-URL och relativ sökväg (t.ex. /members/xxx/videos/file.mp4)
 * så att editor och live-preview får giltig thumbnail även när URL-format skiljer sig.
 *
 * @param videoUrl - Full video URL or S3 key / relativ path
 * @returns Derived thumbnail URL, or undefined if not a valid video URL
 */
export function getVideoThumbnailUrl(videoUrl: string | undefined): string | undefined {
  if (!videoUrl || typeof videoUrl !== 'string') return undefined;

  const trimmed = videoUrl.trim();
  if (!trimmed) return undefined;

  // Video-ändelse krävs
  const extMatch = trimmed.match(/\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i);
  if (!extMatch) return undefined;

  // Primär: samma konvention som CDN – /videos/ -> /thumbnails/
  if (trimmed.includes('/videos/')) {
    return trimmed
      .replace('/videos/', '/thumbnails/')
      .replace(/\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i, '.jpg');
  }

  // Fallback: path innehåller /media/ (t.ex. vissa S3-struktur) -> /thumbnails/
  if (trimmed.includes('/media/')) {
    return trimmed
      .replace(/\/media\//, '/thumbnails/')
      .replace(/\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i, '.jpg');
  }

  // Sista fallback: filnamn med video-ändelse men ingen videos/media-mapp –
  // byt bara ändelse till .jpg (thumbnail kan ligga i samma mapp eller under thumbnails/)
  const withoutQuery = trimmed.split('?')[0];
  if (/\.(mp4|webm|mov|avi|mkv)$/i.test(withoutQuery)) {
    return withoutQuery.replace(/\.(mp4|webm|mov|avi|mkv)$/i, '.jpg');
  }

  return undefined;
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
