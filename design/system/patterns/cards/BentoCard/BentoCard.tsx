'use client';

import React from 'react';
import { Card, Typography } from '../../../components';
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
  /** Image source path */
  imageSrc?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Optional link URL */
  href?: string;
  /** Link text (default: "Läs mer") */
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
  /** Transparent footer (overlays image) */
  transparentFooter?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  componentKey,
  title,
  description,
  imageSrc,
  imageAlt,
  href,
  linkText = 'Läs mer',
  minHeight = '320px',
  variant = 'bordered',
  radius = 'lg',
  accentHover = true,
  imageObjectFit = 'cover',
  imagePadding = 'none',
  colSpan,
  rowSpan,
  showFooter = true,
  showImage = true,
  imageHeight,
  transparentFooter = false,
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

  const footerClasses = [
    'bento-card__footer',
    transparentFooter && 'bento-card__footer--transparent',
  ].filter(Boolean).join(' ');

  return (
    <Card
      variant={variant}
      radius={radius}
      padding="none"
      className={classes}
      data-component-key={componentKey}
      style={gridStyle}
    >
      {/* Image area */}
      {showImage && imageSrc && (
        <div 
          className={`bento-card__image-container bento-card__image-padding--${imagePadding}`}
          style={imageContainerStyle}
        >
          <img
            src={fullImageSrc}
            alt={imageAlt || title || 'Bento card image'}
            className={`bento-card__image bento-card__image--${imageObjectFit}`}
            loading="lazy"
          />
        </div>
      )}

      {/* Footer with title, description and optional link */}
      {showFooter && (
        <div className={footerClasses}>
          <div className="bento-card__footer-content">
            <div className="bento-card__footer-row">
              {title && (
                <Typography variant="h4" weight="semibold" color={transparentFooter ? 'inverse' : 'primary'}>
                  {title}
                </Typography>
              )}
              {href && (
                <TextLink 
                  href={href} 
                  variant={transparentFooter ? 'inverse' : 'brand'}
                  rightIcon={<ArrowRightIcon width={16} height={16} />}
                  className="bento-card__link"
                >
                  {linkText}
                </TextLink>
              )}
            </div>
            {description && (
              <Typography variant="body-sm" color={transparentFooter ? 'inverse' : 'secondary'}>
                {description}
              </Typography>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default BentoCard;
