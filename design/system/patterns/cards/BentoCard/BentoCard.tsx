'use client';

import React from 'react';
import { Card, Typography, HStack, VStack } from '../../../components';
import { TextLink } from '../../../components/actions/TextLink/TextLink';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { CDN_BASE_URL } from '../../../core/utils/env';
import './BentoCard.css';

export interface BentoCardProps {
  componentKey?: string;
  /** Card title */
  title?: string;
  /** Optional description text below title */
  description?: string;
  /** Optional subtitle/tag displayed above image */
  tag?: string;
  /** Image source path */
  imageSrc?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Optional link URL */
  href?: string;
  /** Link text (default: "Learn More") */
  linkText?: string;
  /** Card height */
  minHeight?: string;
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined' | 'bordered';
  /** Card radius */
  radius?: 'sm' | 'md' | 'lg';
  /** Show accent border on hover */
  accentHover?: boolean;
  /** Image object fit */
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none';
  /** Image padding inside card */
  imagePadding?: 'none' | 'sm' | 'md' | 'lg';
  /** Column span for grid layout */
  colSpan?: 1 | 2 | 3;
  /** Row span for grid layout */
  rowSpan?: 1 | 2;
  /** Show/hide footer with title */
  showFooter?: boolean;
  /** Show/hide image area */
  showImage?: boolean;
  /** Specific height for image area */
  imageHeight?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  componentKey,
  title,
  description,
  tag,
  imageSrc,
  imageAlt,
  href,
  linkText = 'Learn More',
  minHeight = '320px',
  variant = 'bordered',
  radius = 'lg',
  accentHover = true,
  imageObjectFit = 'contain',
  imagePadding = 'md',
  colSpan,
  rowSpan,
  showFooter = true,
  showImage = true,
  imageHeight,
}) => {
  const fullImageSrc = imageSrc?.startsWith('http') ? imageSrc : imageSrc ? `${CDN_BASE_URL}${imageSrc}` : '';

  const classes = [
    'bento-card',
    accentHover && 'bento-card--accent-hover',
    !showFooter && 'bento-card--no-footer',
    !showImage && 'bento-card--no-image',
  ].filter(Boolean).join(' ');

  const gridStyle: React.CSSProperties = {
    minHeight,
    ...(colSpan && colSpan > 1 && { gridColumn: `span ${colSpan}` }),
    ...(rowSpan && rowSpan > 1 && { gridRow: `span ${rowSpan}` }),
  };

  const imageContainerStyle: React.CSSProperties = {
    ...(imageHeight && { height: imageHeight, minHeight: imageHeight, flex: 'none' }),
  };

  return (
    <Card
      variant={variant}
      radius={radius}
      padding="none"
      className={classes}
      data-component-key={componentKey}
      style={gridStyle}
    >
      {/* Tag (optional) */}
      {tag && (
        <div className="bento-card__tag">
          <Typography variant="label-sm" color="secondary">
            {tag}
          </Typography>
        </div>
      )}

      {/* Image area */}
      {showImage && imageSrc && (
        <div 
          className={`bento-card__image-container bento-card__image-padding--${imagePadding}`}
          style={imageContainerStyle}
        >
          <img
            src={fullImageSrc}
            alt={imageAlt || title || 'Bento card image'}
            className="bento-card__image"
            style={{ objectFit: imageObjectFit }}
            loading="lazy"
          />
        </div>
      )}

      {/* Footer with title, description and optional link */}
      {showFooter && (title || description) && (
        <div className="bento-card__footer">
          {description ? (
            <VStack spacing="xs" align="stretch">
              <HStack justify="between" align="center" spacing="md">
                {title && (
                  <Typography variant="h4" weight="semibold" color="primary">
                    {title}
                  </Typography>
                )}
                {href && (
                  <TextLink 
                    href={href} 
                    variant="brand"
                    rightIcon={<ArrowRightIcon width={16} height={16} />}
                    className="bento-card__link"
                  >
                    {linkText}
                  </TextLink>
                )}
              </HStack>
              <Typography variant="body-sm" color="secondary">
                {description}
              </Typography>
            </VStack>
          ) : (
            <HStack justify="between" align="center" spacing="md">
              {title && (
                <Typography variant="h4" weight="semibold" color="primary">
                  {title}
                </Typography>
              )}
              {href && (
                <TextLink 
                  href={href} 
                  variant="brand"
                  rightIcon={<ArrowRightIcon width={16} height={16} />}
                  className="bento-card__link"
                >
                  {linkText}
                </TextLink>
              )}
            </HStack>
          )}
        </div>
      )}
    </Card>
  );
};

export default BentoCard;
