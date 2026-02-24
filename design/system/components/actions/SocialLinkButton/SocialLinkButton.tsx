// ===============================================
// design/system/components/actions/SocialLinkButton/SocialLinkButton.tsx
// Button-style link with social platform icon + optional label text.
// Designed for profile/linktree pages — links to social profiles or any URL.
// ===============================================

'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '../../../utils/cn';
import { Label } from '../../Typography/Typography';
import { Component } from '../../frames/component/Component';
import './SocialLinkButton.css';

// Shared CDN URLs (same as SocialIcon)
const socialIconUrls: Record<string, string> = {
  tiktok: 'https://cdn.blimpify-im.com/assets/logo/tik-tok.png',
  instagram: 'https://cdn.blimpify-im.com/assets/logo/instagram.png',
  facebook: 'https://cdn.blimpify-im.com/assets/logo/facebook.png',
  twitter: 'https://cdn.blimpify-im.com/assets/logo/twitter.png',
  x: 'https://cdn.blimpify-im.com/assets/logo/x.png',
  youtube: 'https://cdn.blimpify-im.com/assets/logo/youtube.png',
  linkedin: 'https://cdn.blimpify-im.com/assets/logo/linkedin.png',
  pinterest: 'https://cdn.blimpify-im.com/assets/logo/pinterest.png',
  snapchat: 'https://cdn.blimpify-im.com/assets/logo/snapchat.png',
  threads: 'https://cdn.blimpify-im.com/assets/logo/threads.png',
};

export type SocialLinkPlatform = keyof typeof socialIconUrls;

export interface SocialLinkButtonProps {
  /** Social platform — determines which logo to show */
  platform?: SocialLinkPlatform;
  /** Optional custom image URL (overrides platform logo) */
  imageSrc?: string;
  /** Alt text for custom image */
  imageAlt?: string;
  /** Button label shown next to the icon */
  content?: string;
  /** Link URL */
  href?: string;
  /** Link target */
  target?: '_blank' | '_self';
  /** Visual style */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Corner radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Make button full width */
  fullWidth?: boolean;
  /** Icon color mode */
  iconColor?: 'auto' | 'light' | 'dark';
  /** Data attribute for editor */
  componentKey?: string;
}

export const SocialLinkButton: React.FC<SocialLinkButtonProps> = ({
  platform,
  imageSrc,
  imageAlt,
  content,
  href = '#',
  target = '_blank',
  variant = 'secondary',
  size = 'md',
  radius = 'full',
  fullWidth = true,
  iconColor = 'auto',
  componentKey,
}) => {
  const iconUrl = imageSrc || (platform ? socialIconUrls[platform] : undefined);
  const altText = imageAlt || (platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Link');

  const iconSizePx = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;

  const classes = cn(
    'social-link-btn',
    `social-link-btn--${variant}`,
    `social-link-btn--${size}`,
    `social-link-btn--radius-${radius}`,
    fullWidth && 'social-link-btn--full-width',
  );

  const labelSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';

  const inner = (
    <>
      {iconUrl && (
        <span className="social-link-btn__icon-wrap">
          <Image
            src={iconUrl}
            alt={altText}
            width={iconSizePx}
            height={iconSizePx}
            className={cn('social-link-btn__icon', `social-link-btn__icon--color-${iconColor}`)}
            unoptimized
          />
        </span>
      )}
      {content && (
        <Label size={labelSize} weight="semibold" as="span" className="social-link-btn__label">
          {content}
        </Label>
      )}
    </>
  );

  return (
    <Component componentKey={componentKey}>
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={classes}
        aria-label={content || altText}
      >
        {inner}
      </a>
    </Component>
  );
};

SocialLinkButton.displayName = 'SocialLinkButton';

export default SocialLinkButton;
