import React from 'react';
import { Card, VStack, Typography, Icon } from '../../../components';
import { CDN_BASE_URL } from '../../../core/utils/env';
import {
  VideoCameraIcon,
  MegaphoneIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CameraIcon,
  FilmIcon,
  FireIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import './OverlayCard.css';

// Icon mapping for JSON configuration
const iconMap: Record<string, any> = {
  video: VideoCameraIcon,
  camera: CameraIcon,
  film: FilmIcon,
  megaphone: MegaphoneIcon,
  chart: ChartBarIcon,
  users: UserGroupIcon,
  sparkles: SparklesIcon,
  fire: FireIcon,
  bolt: BoltIcon,
  star: StarIcon,
  heart: HeartIcon,
  chat: ChatBubbleLeftRightIcon,
};

interface OverlayCardProps {
  componentKey?: string;
  heading: string;
  subheading?: string;
  description?: string;
  imageSrc?: string; // Optional now
  imageAlt?: string;
  // Icon support - can be icon name string (for JSON) or React element (for direct usage)
  icon?: string | React.ReactElement;
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  // Overlay mode
  overlayMode?: 'dark' | 'light'; // dark = black overlay with white text, light = white overlay with dark text
  overlayOpacity?: number; // 0-1 (default: 0.5 for dark, 0.7 for light)
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  // Text alignment
  textAlign?: 'left' | 'center' | 'right';
  // Card customization
  cardVariant?: 'default' | 'elevated' | 'outlined' | 'solid';
  cardPadding?: 'sm' | 'md' | 'lg';
  cardRadius?: 'sm' | 'md' | 'lg';
  // Layout customization
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  minHeight?: string; // e.g., '300px', '400px'
}

export type { OverlayCardProps };

export function OverlayCard({
  componentKey,
  heading,
  subheading,
  description,
  imageSrc,
  imageAlt,
  icon,
  iconSize = 'xl',
  // Defaults
  overlayMode = 'dark',
  overlayOpacity,
  imageObjectFit = 'cover',
  textAlign = 'center',
  cardVariant = 'elevated',
  cardPadding = 'lg',
  cardRadius = 'md',
  spacing = 'sm',
  minHeight = '400px'
}: OverlayCardProps) {
  // Map textAlign to VStack align prop
  const getVStackAlign = (align: 'left' | 'center' | 'right'): 'start' | 'center' | 'end' => {
    if (align === 'left') return 'start';
    if (align === 'right') return 'end';
    return 'center';
  };

  // Determine text color based on overlay mode
  const textColor = overlayMode === 'dark' ? 'inverse' : 'primary';
  const textColorSecondary = overlayMode === 'dark' ? 'inverse' : 'secondary';

  // Default opacity based on mode
  const defaultOpacity = overlayMode === 'dark' ? 0.5 : 0.7;
  const finalOpacity = overlayOpacity !== undefined ? overlayOpacity : defaultOpacity;

  // Resolve icon from string name or use React element directly
  const iconElement = React.useMemo(() => {
    if (!icon) return null;

    // If icon is a string, look it up in iconMap
    if (typeof icon === 'string') {
      const IconComponent = iconMap[icon];
      if (IconComponent) {
        return <Icon size={iconSize} color={overlayMode === 'dark' ? 'inverse' : 'primary'}>
          {React.createElement(IconComponent)}
        </Icon>;
      }
      console.warn(`Icon "${icon}" not found in iconMap`);
      return null;
    }

    // If icon is already a React element, wrap it in Icon component
    return <Icon size={iconSize} color={overlayMode === 'dark' ? 'inverse' : 'primary'}>
      {icon}
    </Icon>;
  }, [icon, iconSize, overlayMode]);

  return (
    <Card
      variant={cardVariant}
      padding="none"
      radius={cardRadius}
      className={`overlay-card overlay-card--${overlayMode}`}
      data-component-key={componentKey}
      style={{ minHeight }}
    >
      {/* Background Image with Overlay (optional) */}
      {imageSrc && (
        <div className="overlay-card__background">
          <img
            src={`${CDN_BASE_URL}${imageSrc}`}
            alt={imageAlt || ''}
            className="overlay-card__image"
            style={{ objectFit: imageObjectFit }}
          />
          <div
            className={`overlay-card__overlay overlay-card__overlay--${overlayMode}`}
            style={{ opacity: finalOpacity }}
          />
        </div>
      )}

      {/* Content - Centered Vertically, Customizable Horizontal Alignment */}
      <div
        className={`overlay-card__content overlay-card__content--${textAlign}`}
        style={{ padding: `var(--spacing-${cardPadding})` }}
      >
        <VStack spacing={spacing} align={getVStackAlign(textAlign)}>
          {iconElement}
          <Typography variant="h3" weight="bold" color={textColor}>
            {heading}
          </Typography>
          {subheading && (
            <Typography variant="body-lg" weight="semibold" color={textColorSecondary}>
              {subheading}
            </Typography>
          )}
          {description && (
            <Typography variant="body-md" weight="regular" color={textColorSecondary}>
              {description}
            </Typography>
          )}
        </VStack>
      </div>
    </Card>
  );
}
