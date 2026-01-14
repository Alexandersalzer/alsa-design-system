import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import { Image } from '../../../components/media/Image';
import { CDN_BASE_URL } from '../../../core/utils/env';
import './ContentCard.css';

interface ContentCardProps {
  componentKey?: string;
  heading: string;
  subheading?: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  // Image customization
  imageAspectRatio?: '1/1' | '3/2' | '2/3' | '4/3' | '3/4' | '16/9' | '9/16' | 'square' | 'landscape' | 'portrait' | 'none' | string;
  imageRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  imageObjectPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right' | string;
  // Image height controls - for better control over varied aspect ratios
  imageHeight?: string | number; // Fixed height (e.g., '400px', 400) - overrides aspectRatio
  imageMinHeight?: string | number; // Minimum height (e.g., '300px', 300)
  imageMaxHeight?: string | number; // Maximum height (e.g., '500px', 500)
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
  imageAspectRatio = '1/1',
  imageRadius = 'md',
  imageObjectFit = 'cover',
  imageObjectPosition = 'center',
  imageHeight,
  imageMinHeight,
  imageMaxHeight,
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

  // Build image container styles with height controls
  const hasHeightConstraints = imageHeight || imageMinHeight || imageMaxHeight;

  const imageContainerStyle: React.CSSProperties = {
    ...(imageHeight && { height: typeof imageHeight === 'number' ? `${imageHeight}px` : imageHeight }),
    ...(imageMinHeight && { minHeight: typeof imageMinHeight === 'number' ? `${imageMinHeight}px` : imageMinHeight }),
    ...(imageMaxHeight && { maxHeight: typeof imageMaxHeight === 'number' ? `${imageMaxHeight}px` : imageMaxHeight }),
  };

  // Build image styles
  const imageStyle: React.CSSProperties = hasHeightConstraints
    ? {
        height: '100%',
        width: '100%',
        objectFit: imageObjectFit,
        objectPosition: imageObjectPosition
      }
    : {
        objectPosition: imageObjectPosition
      };

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
          src={`${CDN_BASE_URL}${imageSrc}`}
          alt={imageAlt}
          width="100%"
          aspectRatio={finalAspectRatio}
          objectFit={imageObjectFit}
          radius={imageRadius}
          loading="lazy"
          showSkeleton={true}
          className="content-card-image"
          style={imageStyle}
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
