import React from 'react';
import { VStack, HStack, Typography } from '../../../components';
import { Image } from '../../../components/media/Image';
import { CDN_BASE_URL } from '../../../core/utils/env';
import './AlternatingCardsRow.css';

interface AlternatingCardsRowItem {
  heading: string;
  subheading?: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

interface AlternatingCardsRowProps {
  componentKey?: string;
  items: AlternatingCardsRowItem[];
  // Image customization (applies to all images)
  imageAspectRatio?: '1/1' | '3/2' | '2/3' | '4/3' | '3/4' | '16/9' | '9/16' | 'square' | 'landscape' | 'portrait' | 'none' | string;
  imageRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  imageObjectPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right' | string;
  // Layout customization
  rowGap?: 'sm' | 'md' | 'lg' | 'xl'; // Gap between rows
  columnGap?: 'xs' | 'sm' | 'md' | 'lg'; // Gap between image and text in each row
  textSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Gap between text elements
  maxWidth?: string; // Max width of the entire pattern (e.g., '1200px')
}

export type { AlternatingCardsRowProps, AlternatingCardsRowItem };

export function AlternatingCardsRow({
  componentKey,
  items = [],
  imageAspectRatio = '16/9',
  imageRadius = 'md',
  imageObjectFit = 'cover',
  imageObjectPosition = 'center',
  rowGap = 'xl',
  columnGap = 'lg',
  textSpacing = 'sm',
  maxWidth = '1200px'
}: AlternatingCardsRowProps) {
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
        return undefined;
      default:
        return ratio;
    }
  };

  const finalAspectRatio = getAspectRatio(imageAspectRatio);

  return (
    <div
      className="alternating-cards-row"
      data-component-key={componentKey}
      style={{ maxWidth }}
    >
      <VStack spacing={rowGap} className="alternating-cards-row__container">
        {items.map((item, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <HStack
              key={index}
              spacing={columnGap}
              className={`alternating-cards-row__item ${isReversed ? 'alternating-cards-row__item--reversed' : ''}`}
            >
              {/* Image Container */}
              <div className="alternating-cards-row__image-container">
                <Image
                  src={`${CDN_BASE_URL}${item.imageSrc}`}
                  alt={item.imageAlt}
                  width="100%"
                  aspectRatio={finalAspectRatio}
                  objectFit={imageObjectFit}
                  objectPosition={imageObjectPosition}
                  radius={imageRadius}
                  loading="lazy"
                  showSkeleton={true}
                  className="alternating-cards-row__image"
                />
              </div>

              {/* Text Content */}
              <VStack spacing={textSpacing} className="alternating-cards-row__text">
                <Typography variant="h2" weight="bold" color="primary">
                  {item.heading}
                </Typography>
                {item.subheading && (
                  <Typography variant="body-lg" weight="semibold" color="secondary">
                    {item.subheading}
                  </Typography>
                )}
                <Typography variant="body-md" weight="regular" color="tertiary">
                  {item.description}
                </Typography>
              </VStack>
            </HStack>
          );
        })}
      </VStack>
    </div>
  );
}
