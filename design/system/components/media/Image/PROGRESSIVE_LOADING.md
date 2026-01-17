# Progressive Image Loading (Blur-Up Effect)

The `Image` component now supports progressive loading with blurred placeholders, similar to Medium and modern image CDNs.

## Overview

Instead of showing a blank skeleton or spinner, you can show:
1. **LQIP** (Low Quality Image Placeholder) - A tiny blurred version of the image (~500 bytes)
2. **BlurHash** - An algorithmic blur from a 6-7 character string (~30 bytes)
3. **Dominant Color** - A solid color extracted from the image

## Usage Examples

### 1. LQIP (Recommended for best visual quality)

```tsx
<Image
  src="https://cdn.example.com/photo.jpg"
  lqip="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Tiny 20x20px base64 image
  alt="Photo"
  width={800}
  height={600}
/>
```

**Pros:**
- Best visual quality - actual blurred preview of the image
- Instant display (~500 bytes loads in milliseconds)
- No external libraries needed

**Cons:**
- Requires generating and storing the tiny image
- Slightly larger than BlurHash (~500 bytes vs ~30 bytes)

### 2. Dominant Color (Simplest option)

```tsx
<Image
  src="https://cdn.example.com/photo.jpg"
  placeholderColor="#3B82F6" // Or any valid CSS color
  alt="Photo"
  width={800}
  height={600}
/>
```

**Pros:**
- Simplest implementation - just a color string
- Smallest size (7 bytes for hex color)
- No external libraries needed

**Cons:**
- Less visual information than LQIP
- Can look basic/plain

### 3. BlurHash (Most efficient)

```tsx
<Image
  src="https://cdn.example.com/photo.jpg"
  blurHash="LGF5]+Yk^6#M@-5c,1J5@[or[Q6." // 6-7 character hash
  placeholderColor="#3B82F6" // Fallback color (optional)
  alt="Photo"
  width={800}
  height={600}
/>
```

**Pros:**
- Smallest size (~30 bytes)
- Algorithmic blur looks good
- Popular standard (used by Mastodon, Unsplash, etc.)

**Cons:**
- Requires `blurhash` npm package to decode
- Currently falls back to solid color (not yet implemented)

## How to Generate Placeholders

### Option A: At Build Time (Recommended for Static Sites)

If using Next.js, Gatsby, or any build tool:

```typescript
// scripts/generate-placeholders.ts
import sharp from 'sharp';
import fs from 'fs/promises';

async function generatePlaceholders(imagePath: string) {
  const buffer = await fs.readFile(imagePath);

  // Generate LQIP (20x20px at 20% quality)
  const lqipBuffer = await sharp(buffer)
    .resize(20, 20, { fit: 'cover' })
    .jpeg({ quality: 20 })
    .toBuffer();

  const lqip = `data:image/jpeg;base64,${lqipBuffer.toString('base64')}`;

  // Extract dominant color
  const { dominant } = await sharp(buffer).stats();
  const color = `#${dominant.r.toString(16).padStart(2, '0')}${dominant.g.toString(16).padStart(2, '0')}${dominant.b.toString(16).padStart(2, '0')}`;

  return { lqip, color };
}

// Use in your data fetching
const imageData = {
  src: '/images/photo.jpg',
  lqip: await generatePlaceholders('./public/images/photo.jpg').then(p => p.lqip),
  dominantColor: await generatePlaceholders('./public/images/photo.jpg').then(p => p.color)
};
```

### Option B: Server-Side API (Recommended for Dynamic Images)

```typescript
// app/api/image-metadata/route.ts
import sharp from 'sharp';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  // Fetch the image
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();

  // Generate LQIP
  const lqipBuffer = await sharp(Buffer.from(buffer))
    .resize(20, 20, { fit: 'cover' })
    .jpeg({ quality: 20 })
    .toBuffer();

  const lqip = `data:image/jpeg;base64,${lqipBuffer.toString('base64')}`;

  // Get dominant color
  const { dominant } = await sharp(Buffer.from(buffer)).stats();
  const color = `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`;

  return Response.json({ lqip, color });
}
```

### Option C: CDN/Image Service (Best for Production)

Many modern CDNs support this out of the box:

**Cloudinary:**
```typescript
const imageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
const lqipUrl = 'https://res.cloudinary.com/demo/image/upload/w_20,q_20,e_blur:1000/sample.jpg';

<Image
  src={imageUrl}
  lqip={lqipUrl} // Cloudinary generates it for you
  alt="Photo"
/>
```

**Imgix:**
```typescript
const imageUrl = 'https://assets.imgix.net/sample.jpg';
const lqipUrl = 'https://assets.imgix.net/sample.jpg?w=20&q=20&blur=200';

<Image
  src={imageUrl}
  lqip={lqipUrl}
  alt="Photo"
/>
```

**AWS CloudFront + Lambda@Edge:**
```typescript
// Lambda@Edge can generate LQIP on-the-fly
const imageUrl = 'https://d111111abcdef8.cloudfront.net/photo.jpg';
const lqipUrl = 'https://d111111abcdef8.cloudfront.net/photo.jpg?lqip=true';
```

### Option D: Client-Side (Not Recommended for Production)

Only use this for prototyping:

```tsx
import { useImagePlaceholder } from './image-placeholders';

function MyComponent() {
  const placeholders = useImagePlaceholder(
    'https://cdn.example.com/photo.jpg',
    'color' // or 'lqip' or 'both'
  );

  return (
    <Image
      src="https://cdn.example.com/photo.jpg"
      placeholderColor={placeholders?.dominantColor}
      lqip={placeholders?.lqip}
      alt="Photo"
    />
  );
}
```

**Warning:** This defeats the purpose because it loads the full image to generate the placeholder!

## Comparison Table

| Method | Size | Visual Quality | Setup Complexity | Best For |
|--------|------|----------------|------------------|----------|
| **LQIP** | ~500 bytes | Excellent | Medium | Hero images, galleries |
| **BlurHash** | ~30 bytes | Good | Medium | High-volume images |
| **Dominant Color** | ~7 bytes | Basic | Very Easy | Icons, thumbnails |
| **Skeleton** | 0 bytes | None | Very Easy | When no metadata available |

## Real-World Examples

### Example 1: E-commerce Product Images

```tsx
// products/[id].tsx
const product = {
  imageUrl: 'https://cdn.shop.com/product-123.jpg',
  imageLqip: 'data:image/jpeg;base64,/9j/4AAQ...', // Generated at upload time
  imageColor: '#f3f4f6'
};

<Image
  src={product.imageUrl}
  lqip={product.imageLqip}
  alt={product.name}
  width={600}
  height={600}
  objectFit="cover"
/>
```

### Example 2: User Avatars with Color

```tsx
const user = {
  avatarUrl: 'https://cdn.example.com/avatar-456.jpg',
  avatarColor: '#3b82f6' // Extracted from avatar
};

<AvatarImage
  src={user.avatarUrl}
  placeholderColor={user.avatarColor}
  alt={user.name}
  size="lg"
/>
```

### Example 3: Blog Hero Images

```tsx
const post = {
  heroUrl: 'https://cdn.blog.com/hero-789.jpg',
  heroLqip: 'data:image/jpeg;base64,/9j/4AAQ...',
  heroColor: '#1f2937'
};

<Image
  src={post.heroUrl}
  lqip={post.heroLqip}
  placeholderColor={post.heroColor} // Fallback if LQIP fails
  alt={post.title}
  width="100%"
  aspectRatio="21/9"
  priority // Hero images should load eagerly
/>
```

## Performance Benefits

Without progressive loading:
```
0ms:    [Gray skeleton]
500ms:  [Gray skeleton]
1000ms: [Image appears]
```

With progressive loading:
```
0ms:    [Blurred preview visible instantly]
500ms:  [Blurred preview visible]
1000ms: [Sharp image fades in]
```

Users see **meaningful content immediately** instead of waiting for the full image.

## Recommendations

1. **Use LQIP for important images** (hero images, product photos, gallery images)
2. **Use dominant color for thumbnails** (avatars, small icons, list items)
3. **Generate at upload time** (not at runtime) to avoid performance overhead
4. **Store in your CMS/database** alongside the image URL
5. **Consider using a CDN** that generates these automatically (Cloudinary, Imgix)

## Migration Guide

If you have existing `<Image>` components, you can gradually add progressive loading:

```tsx
// Before (shows skeleton)
<Image src="/photo.jpg" alt="Photo" />

// After (shows blurred preview)
<Image
  src="/photo.jpg"
  placeholderColor="#3b82f6" // Easy first step
  alt="Photo"
/>

// Later (even better)
<Image
  src="/photo.jpg"
  lqip={generatedLqip} // Generate these server-side
  alt="Photo"
/>
```

The component gracefully falls back to skeleton if no placeholder is provided.
