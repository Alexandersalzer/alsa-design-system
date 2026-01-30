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
  /** Footer style: solid (default), glass (blur), transparent (no bg) */
  footerStyle?: 'solid' | 'glass' | 'transparent';
  /** Show border around card */
  showBorder?: boolean;
  /** Border width */
  borderWidth?: 'thin' | 'medium' | 'thick';
  /** Link position: inline (next to title) or bottom (below description) */
  linkPosition?: 'inline' | 'bottom';
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
  variant = 'default',
  radius = 'lg',
  accentHover = true,
  imageObjectFit = 'cover',
  imagePadding = 'none',
  colSpan,
  rowSpan,
  showFooter = true,
  showImage = true,
  imageHeight,
  footerStyle = 'solid',
  showBorder = true,
  borderWidth = 'thin',
  linkPosition = 'inline',
}) => {
  const fullImageSrc = imageSrc?.startsWith('http') ? imageSrc : imageSrc ? `${CDN_BASE_URL}${imageSrc}` : '';

  const isOverlayFooter = footerStyle === 'glass' || footerStyle === 'transparent';

  const classes = [
    'bento-card',
    accentHover && 'bento-card--accent-hover',
    !showFooter && 'bento-card--no-footer',
    !showImage && 'bento-card--no-image',
    showBorder && 'bento-card--bordered',
    showBorder && `bento-card--border-${borderWidth}`,
    isOverlayFooter && 'bento-card--overlay-footer',
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
    `bento-card__footer--${footerStyle}`,
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
                <Typography variant="h4" weight="semibold" color={isOverlayFooter ? 'inverse' : 'primary'}>
                  {title}
                </Typography>
              )}
              {href && linkPosition === 'inline' && (
                <TextLink 
                  href={href} 
                  variant={isOverlayFooter ? 'inverse' : 'brand'}
                  rightIcon={<ArrowRightIcon width={16} height={16} />}
                  className="bento-card__link"
                >
                  {linkText}
                </TextLink>
              )}
            </div>
            {description && (
              <Typography variant="body-sm" color={isOverlayFooter ? 'inverse' : 'secondary'}>
                {description}
              </Typography>
            )}
            {href && linkPosition === 'bottom' && (
              <TextLink 
                href={href} 
                variant={isOverlayFooter ? 'inverse' : 'brand'}
                rightIcon={<ArrowRightIcon width={16} height={16} />}
                className="bento-card__link"
              >
                {linkText}
              </TextLink>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default BentoCard;
