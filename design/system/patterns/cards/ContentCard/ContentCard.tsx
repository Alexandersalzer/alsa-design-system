import { Card, VStack, Typography } from '../../../components';
import { SquareImageContainer } from '../../../components/media/SquareImageContainer';
import { ImageBackground } from '../../../components/backgrounds/ImageBackground/ImageBackground';
import { resolveCdnImageUrl } from '../../../core/utils/env';
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
  /** Accent-tint: motiv i accentfärg, dark mode fyller vita delar med surface-page */
  imageTint?: 'accent' | 'none';
  /** Styrka på accent-tint (0–2, default 1.2). Högre = tydligare färg. */
  imageTintStrength?: number;
  // Image container padding - creates space between container edge and image
  imagePadding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // Image overflow behavior - whether overflowing image is visible or clipped
  imageOverflow?: 'hidden' | 'visible';
  // Card customization
  cardVariant?: 'default' | 'elevated' | 'outlined' | 'solid' | 'bordered';
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
  imageTint = 'none',
  imageTintStrength = 1.2,
  imagePadding = 'none',
  imageOverflow = 'hidden',
  cardVariant = 'bordered',
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
  const fullImageSrc = resolveCdnImageUrl(imageSrc || '');

  // Render SquareImageContainer mode
  if (imageDisplayMode === 'squareContainer') {
    return (
      <div className="content-card" data-component-key={componentKey}>
        {/* Square Image Container - handles all aspect ratios consistently */}
        <Card
          variant={cardVariant}
          padding="none"
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

  // Default mode – ImageBackground (samma som pricing/hero) så accent fungerar utan CORS/Image-problem
  return (
    <div className="content-card" data-component-key={componentKey}>
      <Card
        variant={cardVariant}
        padding="none"
        className="content-card-image-container"
      >
        <div
          className="content-card-image-wrap"
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            ...(finalAspectRatio ? { aspectRatio: finalAspectRatio } : { minHeight: 120 }),
          }}
        >
          <ImageBackground
            src={fullImageSrc}
            size={imageObjectFit}
            position={imageObjectPosition}
            tint={imageTint}
            tintStrength={imageTintStrength}
          />
        </div>
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
