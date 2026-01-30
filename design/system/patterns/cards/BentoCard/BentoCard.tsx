'use client';

import React from 'react';
import { Card, Typography, HStack } from '../../../components';
import { TextLink } from '../../../components/actions/TextLink/TextLink';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { CDN_BASE_URL } from '../../../core/utils/env';
import './BentoCard.css';

export interface BentoCardProps {
  componentKey?: string;
  /** Card title */
  title: string;
  /** Optional subtitle/tag displayed above image */
  tag?: string;
  /** Image source path */
  imageSrc: string;
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
}

export const BentoCard: React.FC<BentoCardProps> = ({
  componentKey,
  title,
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
}) => {
  const fullImageSrc = imageSrc.startsWith('http') ? imageSrc : `${CDN_BASE_URL}${imageSrc}`;

  const classes = [
    'bento-card',
    accentHover && 'bento-card--accent-hover',
  ].filter(Boolean).join(' ');

  return (
    <Card
      variant={variant}
      radius={radius}
      padding="none"
      className={classes}
      data-component-key={componentKey}
      style={{ minHeight }}
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
      <div 
        className={`bento-card__image-container bento-card__image-padding--${imagePadding}`}
      >
        <img
          src={fullImageSrc}
          alt={imageAlt || title}
          className="bento-card__image"
          style={{ objectFit: imageObjectFit }}
          loading="lazy"
        />
      </div>

      {/* Footer with title and optional link */}
      <div className="bento-card__footer">
        <HStack justify="between" align="center" spacing="md">
          <Typography variant="h4" weight="semibold" color="primary">
            {title}
          </Typography>
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
      </div>
    </Card>
  );
};

export default BentoCard;
