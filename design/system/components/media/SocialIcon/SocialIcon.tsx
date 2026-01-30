// ===============================================
// design/system/components/media/SocialIcon/SocialIcon.tsx
// SOCIAL MEDIA ICON COMPONENT - Brand logos from CDN
// URLs defined here for reusability across all JSON configs
// ===============================================

import React from 'react';
import Image from 'next/image';
import { cn } from '../../../utils/cn';
import './SocialIcon.css';

// ===== SOCIAL ICON URLS (centralized for reuse) =====
const socialIconUrls: Record<string, string> = {
  'tiktok': 'https://cdn.blimpify-im.com/assets/logo/tik-tok.png',
  'instagram': 'https://cdn.blimpify-im.com/assets/logo/instagram.png',
  'facebook': 'https://cdn.blimpify-im.com/assets/logo/facebook.png',
  'twitter': 'https://cdn.blimpify-im.com/assets/logo/twitter.png',
  'x': 'https://cdn.blimpify-im.com/assets/logo/x.png',
  'youtube': 'https://cdn.blimpify-im.com/assets/logo/youtube.png',
  'linkedin': 'https://cdn.blimpify-im.com/assets/logo/linkedin.png',
  'pinterest': 'https://cdn.blimpify-im.com/assets/logo/pinterest.png',
  'snapchat': 'https://cdn.blimpify-im.com/assets/logo/snapchat.png',
  'threads': 'https://cdn.blimpify-im.com/assets/logo/threads.png',
};

// ===== SIZE MAPPINGS =====
const sizeMap: Record<string, number> = {
  'xs': 16,
  'sm': 20,
  'md': 24,
  'lg': 32,
  'xl': 40,
  '2xl': 48,
};

export type SocialPlatform = 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'x' | 'youtube' | 'linkedin' | 'pinterest' | 'snapchat' | 'threads';
export type SocialIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface SocialIconProps {
  /** Social media platform name */
  platform: SocialPlatform;
  /** Icon size */
  size?: SocialIconSize;
  /** Optional link URL (wraps icon in anchor) */
  href?: string;
  /** Link target */
  target?: '_blank' | '_self';
  /** Accessible label */
  'aria-label'?: string;
  /** Additional CSS class */
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  size = 'md',
  href,
  target = '_blank',
  'aria-label': ariaLabel,
  className,
}) => {
  const iconUrl = socialIconUrls[platform];
  
  if (!iconUrl) {
    console.warn(`Social icon for "${platform}" not found. Available platforms: ${Object.keys(socialIconUrls).join(', ')}`);
    return null;
  }

  const iconSize = sizeMap[size];
  const label = ariaLabel || `${platform.charAt(0).toUpperCase() + platform.slice(1)}`;

  const iconElement = (
    <Image
      src={iconUrl}
      alt={label}
      width={iconSize}
      height={iconSize}
      className={cn('social-icon', `social-icon--${size}`, className)}
      unoptimized // CDN images don't need Next.js optimization
    />
  );

  if (href) {
    return (
      <a 
        href={href} 
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        aria-label={label}
        className="social-icon__link"
      >
        {iconElement}
      </a>
    );
  }

  return iconElement;
};

SocialIcon.displayName = 'SocialIcon';

// Export available platforms for documentation
export const availablePlatforms = Object.keys(socialIconUrls) as SocialPlatform[];

export default SocialIcon;
