# URL Normalization for CDN Assets

## Problem

Swedish characters (å, ä, ö) and other Unicode characters in filenames cause CDN URL mismatches:

- **Browser sends**: `månadsresultat.png` → `m%C3%A5nadsresultat.png` (percent-encoded)
- **S3 stores**: `månadsresultat.png` with Unicode combining characters (å = a + ˚)
- **Result**: 404 errors, broken images, cache misses

## Solution

**Normalize filenames once during upload, store normalized, always use normalized.**

### 1. Normalization Function

```typescript
// Converts: "månadsresultat.png" → "manadsresultat.png"
function normalizeFilename(filename: string): string {
  return filename
    .normalize("NFKD")              // Split accents (å → a + ˚)
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .replace(/å/gi, "a")             // Swedish å → a
    .replace(/ä/gi, "a")             // Swedish ä → a
    .replace(/ö/gi, "o")             // Swedish ö → o
    .replace(/[^a-z0-9._-]/gi, "-")  // Safe chars only
    .replace(/-+/g, "-")             // Collapse dashes
    .replace(/^-|-$/g, "")           // Trim dashes
    .toLowerCase();
}
```

### 2. Upload Flow (Next.js API Route)

```typescript
// app/api/upload/route.ts
import { prepareFileUpload } from '@blimpify-ui/design/system/core/utils/upload';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const userId = formData.get('userId') as string;

  // 1. Normalize filename
  const upload = prepareFileUpload(file, userId, 'images');
  // upload.s3Key = 'members/user-123/images/manadsresultat.png'
  // upload.safeFilename = 'manadsresultat.png'

  // 2. Upload to S3 with normalized key
  const s3Client = new S3Client({ region: 'eu-north-1' });
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: upload.s3Key,  // ← NORMALIZED KEY
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: upload.contentType,
    Metadata: {
      originalFilename: upload.originalFilename  // Keep for reference
    }
  }));

  // 3. Return normalized CDN URL
  return Response.json({
    url: `https://cdn.blimpify-im.com/${upload.s3Key}`,
    filename: upload.safeFilename
  });
}
```

### 3. Frontend Usage (Image/Video Components)

**Automatic normalization** - components handle it for you:

```tsx
// Works with both original and normalized URLs
<Image
  src="https://cdn.blimpify-im.com/members/user-123/images/månadsresultat.png"
  alt="Monthly results"
/>

// Component automatically normalizes to:
// "https://cdn.blimpify-im.com/members/user-123/images/manadsresultat.png"
```

```tsx
<VideoShowcase
  src="https://cdn.blimpify-im.com/members/user-123/videos/månadsvideo.mp4"
  poster="https://cdn.blimpify-im.com/members/user-123/thumbnails/månadsvideo.jpg"
/>

// Both URLs automatically normalized
```

### 4. Manual Normalization (if needed)

```typescript
import { normalizeCdnUrl, normalizeFilename } from '@blimpify-ui/design/system/core/utils/media';

// Normalize full URL
const url = normalizeCdnUrl('https://cdn.blimpify-im.com/månadsresultat.png');
// → 'https://cdn.blimpify-im.com/manadsresultat.png'

// Normalize just filename
const filename = normalizeFilename('räksmörgås 2024.jpg');
// → 'raksmorgas-2024.jpg'
```

## Benefits

✅ **No more 404s** - Consistent URLs between upload and retrieval
✅ **CDN-friendly** - Deterministic URLs improve cache hit rates
✅ **SEO-safe** - URL-safe characters only
✅ **Future-proof** - Works across all platforms, languages, and CDNs
✅ **Industry standard** - Used by WordPress, Shopify, AWS, Cloudflare

## Migration Strategy

### For Existing Files

**Option 1: Gradual normalization (recommended)**
```typescript
// In Image/Video components (ALREADY IMPLEMENTED)
// Components auto-normalize URLs on render
// No database changes needed
```

**Option 2: Batch rename S3 objects**
```typescript
// Script to rename existing S3 objects
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { normalizeFilename } from './media';

async function migrateS3Objects(bucket: string, prefix: string) {
  const s3 = new S3Client({ region: 'eu-north-1' });

  // 1. List objects with special characters
  const objects = await s3.send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix
  }));

  for (const obj of objects.Contents || []) {
    const oldKey = obj.Key!;
    const filename = oldKey.split('/').pop()!;
    const normalizedFilename = normalizeFilename(filename);

    // Skip if already normalized
    if (filename === normalizedFilename) continue;

    const newKey = oldKey.replace(filename, normalizedFilename);

    // Copy to new key
    await s3.send(new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `${bucket}/${oldKey}`,
      Key: newKey
    }));

    // Delete old key
    await s3.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: oldKey
    }));

    console.log(`Migrated: ${oldKey} → ${newKey}`);
  }
}
```

**Option 3: Database URL rewrite**
```sql
-- Update existing URLs in database (if stored)
UPDATE content_items
SET image_url = REPLACE(
  REPLACE(
    REPLACE(image_url, 'å', 'a'),
    'ä', 'a'),
  'ö', 'o')
WHERE image_url LIKE '%å%'
   OR image_url LIKE '%ä%'
   OR image_url LIKE '%ö%';
```

## Testing

```typescript
import { normalizeFilename, normalizeCdnUrl } from '@blimpify-ui/design/system/core/utils/media';

// Test cases
expect(normalizeFilename('månadsresultat.png')).toBe('manadsresultat.png');
expect(normalizeFilename('Björk Café.jpg')).toBe('bjork-cafe.jpg');
expect(normalizeFilename('räksmörgås 2024.mp4')).toBe('raksmorgas-2024.mp4');
expect(normalizeFilename('TËST_Fîlé.pdf')).toBe('test-file.pdf');

expect(normalizeCdnUrl('https://cdn.example.com/images/månadsresultat.png'))
  .toBe('https://cdn.example.com/images/manadsresultat.png');
```

## Implementation Checklist

- [x] Add `normalizeFilename()` utility to `media.ts`
- [x] Add `normalizeCdnUrl()` for full URL normalization
- [x] Update `Image` component to auto-normalize URLs
- [x] Update `Video` component to auto-normalize URLs
- [x] Update `VideoShowcase` component to auto-normalize URLs
- [x] Update `getVideoThumbnailUrl()` to normalize thumbnail URLs
- [x] Create `upload.ts` with `prepareFileUpload()` helper
- [ ] Update Next.js upload API routes to use `prepareFileUpload()`
- [ ] (Optional) Run S3 migration script for existing files
- [ ] (Optional) Update database URLs if stored

## Architecture Decision

**Why normalize at component level AND upload level?**

1. **Upload normalization** = Source of truth (prevents bad data)
2. **Component normalization** = Defense in depth (handles legacy data)

This dual approach ensures:
- New uploads are always normalized
- Old URLs continue to work
- No breaking changes
- Gradual migration path
