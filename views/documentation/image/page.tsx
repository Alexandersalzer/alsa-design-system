"use client";

import React from 'react';
import { Box, Body, Image, VStack, HStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function ImagePage() {
  return (
    <ComponentDocPage
      componentName="Image"
      description="Optimized image component with built-in lazy loading, multiple size options, border radius controls, and fallback handling"
      importStatement={`import { Image } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple image with src and alt text',
          preview: (
            <Image
              src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400"
              alt="Example image"
              width={300}
              height={200}
              radius="md"
            />
          ),
          code: `import { Image } from '../../../design/index';

export function BasicImage() {
  return (
    <Image
      src="https://example.com/image.jpg"
      alt="Example image"
      width={300}
      height={200}
    />
  );
}`,
        },

        {
          title: 'Sizes',
          description: 'Predefined size variants for common use cases',
          preview: (
            <HStack spacing="md" align="end">
              <VStack spacing="xs" align="center">
                <Image src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=100" alt="Small" width="sm" />
                <Body size="xs" color="secondary">size="sm"</Body>
              </VStack>
              <VStack spacing="xs" align="center">
                <Image src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=200" alt="Medium" width="md" />
                <Body size="xs" color="secondary">size="md"</Body>
              </VStack>
              <VStack spacing="xs" align="center">
                <Image src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=300" alt="Large" width="lg" />
                <Body size="xs" color="secondary">size="lg"</Body>
              </VStack>
              <VStack spacing="xs" align="center">
                <Image src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400" alt="Extra Large" width="xl" />
                <Body size="xs" color="secondary">size="xl"</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Image } from '../../../design/index';

export function ImageSizes() {
  return (
    <>
      <Image src="..." alt="Small" width="sm" />
      <Image src="..." alt="Medium" width="md" />
      <Image src="..." alt="Large" width="lg" />
      <Image src="..." alt="Extra Large" width="xl" />
    </>
  );
}`,
        },

        {
          title: 'Border Radius',
          description: 'Control corner rounding with radius prop',
          preview: (
            <HStack spacing="md" align="center" style={{ flexWrap: 'wrap' }}>
              {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((r) => (
                <VStack key={r} spacing="xs" align="center">
                  <Image
                    src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=200"
                    alt={`radius ${r}`}
                    width={80}
                    height={80}
                    radius={r}
                    objectFit="cover"
                  />
                  <Body size="xs" color="secondary">"{r}"</Body>
                </VStack>
              ))}
            </HStack>
          ),
          code: `import { Image } from '../../../design/index';

export function ImageRadius() {
  return (
    <>
      <Image src="..." alt="..." width={80} height={80} radius="none" />
      <Image src="..." alt="..." width={80} height={80} radius="sm" />
      <Image src="..." alt="..." width={80} height={80} radius="md" />
      <Image src="..." alt="..." width={80} height={80} radius="lg" />
      <Image src="..." alt="..." width={80} height={80} radius="xl" />
      <Image src="..." alt="..." width={80} height={80} radius="full" />
    </>
  );
}`,
        },

        {
          title: 'Object Fit',
          description: 'Control how images fill their container',
          preview: (
            <HStack spacing="md" align="center">
              {(['cover', 'contain', 'fill'] as const).map((fit) => (
                <VStack key={fit} spacing="xs" align="center">
                  <Box style={{ width: '160px', height: '120px', border: '1px dashed var(--border-default)' }}>
                    <Image
                      src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400"
                      alt={fit}
                      width={160}
                      height={120}
                      objectFit={fit}
                      radius="md"
                    />
                  </Box>
                  <Body size="xs" color="secondary">objectFit="{fit}"</Body>
                </VStack>
              ))}
            </HStack>
          ),
          code: `import { Image } from '../../../design/index';

export function ImageObjectFit() {
  return (
    <>
      <Image src="..." alt="Cover" width={200} height={150} objectFit="cover" />
      <Image src="..." alt="Contain" width={200} height={150} objectFit="contain" />
      <Image src="..." alt="Fill" width={200} height={150} objectFit="fill" />
    </>
  );
}`,
        },

        {
          title: 'Lazy Loading',
          description: 'Enable lazy loading for better performance',
          preview: (
            <Image
              src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400"
              alt="Lazy loaded image"
              width={300}
              height={200}
              radius="md"
            />
          ),
          code: `import { Image } from '../../../design/index';

export function LazyImage() {
  return (
    <Image
      src="https://example.com/image.jpg"
      alt="Lazy loaded image"
      width={300}
      height={200}
      lazy
    />
  );
}`,
        },

        {
          title: 'Practical Examples',
          description: 'Common image usage patterns',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 480 }}>
              <Box display="flex" gap="md" align="center" padding="md" border="default" radius="md">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"
                  alt="Product"
                  width={80}
                  height={80}
                  radius="md"
                  objectFit="cover"
                />
                <VStack spacing="xs">
                  <Body weight="bold">Premium Headphones</Body>
                  <Body size="sm" color="secondary">High-quality wireless headphones</Body>
                  <Body weight="medium">$299.99</Body>
                </VStack>
              </Box>
              <Box display="flex" gap="sm" padding="md" border="default" radius="md">
                {[
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
                  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=100',
                  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100',
                  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
                ].map((src, i) => (
                  <Image key={i} src={src} alt={`Thumbnail ${i + 1}`} width={64} height={64} radius="md" objectFit="cover" />
                ))}
              </Box>
            </VStack>
          ),
          code: `import { Image, Box, Body, HStack, VStack } from '../../../design/index';

export function ImageExamples() {
  return (
    <>
      {/* Product card */}
      <HStack spacing="md" align="center">
        <Image src="product.jpg" alt="Product" width={80} height={80} radius="md" objectFit="cover" />
        <VStack spacing="xs">
          <Body weight="bold">Premium Headphones</Body>
          <Body size="sm" color="secondary">High-quality wireless headphones</Body>
          <Body weight="medium">$299.99</Body>
        </VStack>
      </HStack>

      {/* Thumbnail gallery */}
      <Box display="flex" gap="sm">
        {images.map((src, i) => (
          <Image key={i} src={src} alt={\`Thumbnail \${i + 1}\`} width={64} height={64} radius="md" objectFit="cover" />
        ))}
      </Box>
    </>
  );
}`,
        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Body color="secondary" size="md">
          <strong>Best Practices:</strong> Always include descriptive alt text for accessibility.
          Use lazy loading for images below the fold to improve initial page load performance.
        </Body>
        <Body color="secondary" size="md">
          <strong>Performance:</strong> Use appropriate image sizes and formats (WebP when supported) for optimal performance.
        </Body>
        <Body color="secondary" size="md">
          <strong>Accessibility:</strong> Alt text is required and should be descriptive. For decorative images, use an empty alt attribute.
        </Body>
      </Box>
    </ComponentDocPage>
  );
}
