'use client';

import React from 'react';
import Link from 'next/link';
import { Typography, Label } from '../../../components';
import { TextLink } from '../../../components/actions/TextLink/TextLink';
import { Image } from '../../../components/media/Image';
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
  /** Hover effect style */
  hoverEffect?: 'none' | 'accent' | 'lift' | 'glow' | 'scale' | 'border' | 'shine' | 'elevated' | 'interactive' | 'subtle';
  /** @deprecated Use hoverEffect instead */
  accentHover?: boolean;
  /** Image object fit */
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none';
  /** Image padding inside card */
  imagePadding?: 'none' | 'sm' | 'md' | 'lg';
  /** Column span for grid layout (1-12) */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Row span for grid layout */
  rowSpan?: 1 | 2 | 3;
  /** Show/hide image area */
  showImage?: boolean;
  /** Specific height for image area */
  imageHeight?: string;
  /** Footer style: solid (default), raised (solid with shadow), glass (blur), transparent (no bg), none (no footer) */
  footerStyle?: 'solid' | 'raised' | 'glass' | 'transparent' | 'none';
  /** Border style: none, solid, subtle, strong, accent */
  borderStyle?: 'none' | 'solid' | 'subtle' | 'strong' | 'accent';
  /** @deprecated Use borderStyle instead */
  showBorder?: boolean;
  /** @deprecated Use borderStyle instead */
  borderWidth?: 'thin' | 'medium' | 'thick';
  /** Link position: inline (next to title), bottom (below description), bottom-right (same row as description, right aligned) */
  linkPosition?: 'inline' | 'bottom' | 'bottom-right';
  /** Show/hide the link text (card still clickable if href exists) */
  showLink?: boolean;
  /** Add elevation/shadow to footer */
  footerElevated?: boolean;
  /** Scale image to fill the card (may crop/zoom). If false, image keeps proportions without zoom. */
  scaleImageToFill?: boolean;
  /** När showImage är false: bakgrund över hela kortet (samma som textrutan). Påverkar bara kort utan bild. */
  noImageBackground?: 'surface' | 'raised' | 'elevated' | 'secondary';
  /** Accent-tint: motiv i accentfärg (samma som hero). Default accent så alla kortbilder anpassas. */
  imageTint?: 'accent' | 'none';
}

export const BentoCard: React.FC<BentoCardProps> = ({
  componentKey,
  title,
  description,
  imageSrc,
  imageAlt,
  href,
  linkText = 'Läs mer',
  minHeight,
  variant = 'default',
  radius = 'lg',
  hoverEffect = 'accent',
  accentHover,
  imageObjectFit = 'cover',
  imagePadding = 'none',
  colSpan,
  rowSpan,
  showImage = true,
  imageHeight,
  footerStyle = 'solid',
  borderStyle = 'subtle',
  showBorder,
  borderWidth,
  linkPosition = 'inline',
  showLink = true,
  footerElevated = false,
  scaleImageToFill,
  noImageBackground = 'surface',
  imageTint = 'accent',
}) => {
  const fullImageSrc = imageSrc?.startsWith('http') ? imageSrc : imageSrc ? `${CDN_BASE_URL}${imageSrc}` : '';

  const showFooter = footerStyle !== 'none';
  const isOverlayFooter = footerStyle === 'glass' || footerStyle === 'transparent';
  
  // Support legacy showBorder prop - map to borderStyle
  const effectiveBorderStyle = showBorder !== undefined 
    ? (showBorder ? 'solid' : 'none') 
    : borderStyle;
  
  // Support legacy accentHover prop - map to hoverEffect
  const effectiveHoverEffect = accentHover !== undefined 
    ? (accentHover ? 'accent' : 'none') 
    : hoverEffect;

  // Support scaleImageToFill prop - overrides imageObjectFit when defined
  const effectiveImageObjectFit = scaleImageToFill !== undefined
    ? (scaleImageToFill ? 'cover' : 'contain')
    : imageObjectFit;

  // Card is clickable if it has href
  const isClickable = !!href;

  const classes = [
    'bento-card',
    `bento-card--radius-${radius}`,
    // Only apply hover effect if card has href (is clickable)
    href && effectiveHoverEffect !== 'none' && `bento-card--hover-${effectiveHoverEffect}`,
    !showFooter && 'bento-card--no-footer',
    !showImage && 'bento-card--no-image',
    !showImage && `bento-card--no-image-bg-${noImageBackground}`,
    effectiveBorderStyle !== 'none' && `bento-card--border-${effectiveBorderStyle}`,
    isOverlayFooter && 'bento-card--overlay-footer',
    isClickable && 'bento-card--clickable',
  ].filter(Boolean).join(' ');

  const gridStyle: React.CSSProperties = {
    ...(minHeight && { minHeight }),
    ...(colSpan && colSpan > 1 && { gridColumn: `span ${colSpan}` }),
    ...(rowSpan && rowSpan > 1 && { gridRow: `span ${rowSpan}` }),
  };

  const imageContainerStyle: React.CSSProperties = {
    ...(imageHeight && { height: imageHeight, minHeight: imageHeight, flex: 'none' }),
  };

  const footerClasses = [
    'bento-card__footer',
    `bento-card__footer--${footerStyle}`,
    footerElevated && 'bento-card__footer--elevated',
  ].filter(Boolean).join(' ');

  // Render link indicator (visual only, not a real link when card is clickable)
  const renderLinkIndicator = () => (
    <span className={`bento-card__link-indicator ${isOverlayFooter ? 'bento-card__link-indicator--inverse' : 'bento-card__link-indicator--brand'}`}>
      <Label size="sm" weight="medium" as="span" style={{ color: 'inherit' }}>
        {linkText}
      </Label>
      <ArrowRightIcon width={16} height={16} />
    </span>
  );

  const cardContent = (
    <>
      {/* Image area */}
      {showImage && imageSrc && (
        <div 
          className={`bento-card__image-container bento-card__image-padding--${imagePadding}`}
          style={imageContainerStyle}
        >
          <Image
            src={fullImageSrc}
            alt={imageAlt || title || 'Bento card image'}
            width="100%"
            height="100%"
            objectFit={effectiveImageObjectFit}
            radius="none"
            loading="lazy"
            tint={imageTint}
            className={`bento-card__image bento-card__image--${effectiveImageObjectFit}`}
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
              {href && showLink && linkPosition === 'inline' && (
                isClickable ? renderLinkIndicator() : (
                  <TextLink 
                    href={href} 
                    variant={isOverlayFooter ? 'inverse' : 'brand'}
                    rightIcon={<ArrowRightIcon width={16} height={16} />}
                    className="bento-card__link"
                  >
                    {linkText}
                  </TextLink>
                )
              )}
            </div>
            {/* Description with optional bottom-right link */}
            {linkPosition === 'bottom-right' ? (
              <div className="bento-card__description-row">
                {description && (
                  <Typography variant="body-sm" color={isOverlayFooter ? 'inverse' : 'secondary'}>
                    {description}
                  </Typography>
                )}
                {href && showLink && (
                  isClickable ? renderLinkIndicator() : (
                    <TextLink 
                      href={href} 
                      variant={isOverlayFooter ? 'inverse' : 'brand'}
                      rightIcon={<ArrowRightIcon width={16} height={16} />}
                      className="bento-card__link"
                    >
                      {linkText}
                    </TextLink>
                  )
                )}
              </div>
            ) : (
              <>
                {description && (
                  <Typography variant="body-sm" color={isOverlayFooter ? 'inverse' : 'secondary'}>
                    {description}
                  </Typography>
                )}
                {href && showLink && linkPosition === 'bottom' && (
                  isClickable ? renderLinkIndicator() : (
                    <TextLink 
                      href={href} 
                      variant={isOverlayFooter ? 'inverse' : 'brand'}
                      rightIcon={<ArrowRightIcon width={16} height={16} />}
                      className="bento-card__link"
                    >
                      {linkText}
                    </TextLink>
                  )
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );

  // If clickable, wrap in Link
  if (isClickable) {
    return (
      <Link
        href={href}
        className={classes}
        data-component-key={componentKey}
        style={gridStyle}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      className={classes}
      data-component-key={componentKey}
      style={gridStyle}
    >
      {cardContent}
    </div>
  );
};

export default BentoCard;
