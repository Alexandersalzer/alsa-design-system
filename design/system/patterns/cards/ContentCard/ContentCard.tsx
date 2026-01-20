import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import { Image } from '../../../components/media/Image';
import { SquareImageContainer } from '../../../components/media/SquareImageContainer';
import { CDN_BASE_URL } from '../../../core/utils/env';
import './ContentCard.css';

interface ContentCardProps {
  componentKey?: string;
  heading: string;
  subheading?: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  // Image display mode
  imageDisplayMode?: 'default' | 'squareContainer';
  // Image customization (for default mode)
  imageAspectRatio?: '1/1' | '3/2' | '2/3' | '4/3' | '3/4' | '16/9' | '9/16' | 'square' | 'landscape' | 'portrait' | 'none' | string;
  imageRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  imageObjectPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right' | string;
  // Image height controls - for better control over varied aspect ratios
  imageHeight?: string | number; // Fixed height (e.g., '400px', 400) - overrides aspectRatio
  imageMinHeight?: string | number; // Minimum height (e.g., '300px', 300)
  imageMaxHeight?: string | number; // Maximum height (e.g., '500px', 500)
  // Image container padding - creates space between container edge and image
  imagePadding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // Image overflow behavior - whether overflowing image is visible or clipped
  imageOverflow?: 'hidden' | 'visible';
  // Card customization
  cardVariant?: 'default' | 'elevated' | 'outlined' | 'solid' | 'bordered';
  cardPadding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  // Layout customization
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export type { ContentCardProps };

export function ContentCard({
  componentKey,
  heading,
  subheading,
  description,
  imageSrc,
  imageAlt,
  // Defaults
  imageDisplayMode = 'default',
  imageAspectRatio = '1/1',
  imageRadius = 'md',
  imageObjectFit = 'cover',
  imageObjectPosition = 'center',
  imageHeight,
  imageMinHeight,
  imageMaxHeight,
  imagePadding = 'none',
  imageOverflow = 'hidden',
  cardVariant = 'bordered',
  cardPadding = 'none',
  spacing = 'sm'
}: ContentCardProps) {
  // Map preset aspect ratios
  const getAspectRatio = (ratio: string): string | undefined => {
    switch (ratio) {
      case 'square':
        return '1/1';
      case 'landscape':
        return '16/9';
      case 'portrait':
        return '9/16';
      case 'none':
        return undefined; // No aspect ratio constraint
      default:
        return ratio;
    }
  };

  const finalAspectRatio = getAspectRatio(imageAspectRatio);

  // Map padding values to actual spacing
  const getPaddingValue = (padding: string): string => {
    const paddingMap: Record<string, string> = {
      'none': '0',
      'xs': '0.5rem',   // 8px
      'sm': '1rem',     // 16px
      'md': '1.5rem',   // 24px
      'lg': '2rem',     // 32px
      'xl': '3rem',     // 48px
    };
    return paddingMap[padding] || '0';
  };

  // Build image container styles with height controls and padding (for default mode)
  const imageContainerStyle: React.CSSProperties = {
    ...(imageHeight && { height: typeof imageHeight === 'number' ? `${imageHeight}px` : imageHeight }),
    ...(imageMinHeight && { minHeight: typeof imageMinHeight === 'number' ? `${imageMinHeight}px` : imageMinHeight }),
    ...(imageMaxHeight && { maxHeight: typeof imageMaxHeight === 'number' ? `${imageMaxHeight}px` : imageMaxHeight }),
    overflow: imageOverflow,
    padding: getPaddingValue(imagePadding),
  };

  const fullImageSrc = `${CDN_BASE_URL}${imageSrc}`;

  // Render SquareImageContainer mode
  if (imageDisplayMode === 'squareContainer') {
    return (
      <div className="content-card" data-component-key={componentKey}>
        {/* Square Image Container - handles all aspect ratios consistently */}
        <Card
          variant={cardVariant}
          padding={cardPadding}
          className="content-card-image-container"
        >
          <SquareImageContainer
            src={fullImageSrc}
            alt={imageAlt}
            padding={imagePadding}
            radius={imageRadius === 'full' ? 'xl' : imageRadius}
            imageRadius={imageRadius === 'full' ? 'xl' : imageRadius}
            overflow={imageOverflow}
          />
        </Card>

        {/* Text Content - VStack with no background, left aligned */}
        <VStack spacing={spacing} className="content-card-text">
          <Typography variant="h2" weight="bold" color="primary">
            {heading}
          </Typography>
          {subheading && (
            <Typography variant="body-lg" weight="semibold" color="secondary">
              {subheading}
            </Typography>
          )}
          <Typography variant="body-md" weight="regular" color="tertiary">
            {description}
          </Typography>
        </VStack>
      </div>
    );
  }

  // Default mode - original behavior
  return (
    <div className="content-card" data-component-key={componentKey}>
      {/* Image Card - separate container with background */}
      <Card
        variant={cardVariant}
        padding={cardPadding}
        className="content-card-image-container"
        style={imageContainerStyle}
      >
        <Image
          src={fullImageSrc}
          alt={imageAlt}
          width="100%"
          height="100%"
          aspectRatio={finalAspectRatio}
          objectFit={imageObjectFit}
          objectPosition={imageObjectPosition}
          radius={imageRadius}
          loading="lazy"
          showSkeleton={true}
          className="content-card-image"
        />
      </Card>

      {/* Text Content - VStack with no background, left aligned */}
      <VStack spacing={spacing} className="content-card-text">
        <Typography variant="h2" weight="bold" color="primary">
          {heading}
        </Typography>
        {subheading && (
          <Typography variant="body-lg" weight="semibold" color="secondary">
            {subheading}
          </Typography>
        )}
        <Typography variant="body-md" weight="regular" color="tertiary">
          {description}
        </Typography>
      </VStack>
    </div>
  );
}
