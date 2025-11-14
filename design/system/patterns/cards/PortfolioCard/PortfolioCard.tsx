// ===============================================
// design/system/components/patterns/client/PortfolioCard/PortfolioCard.tsx
// PORTFOLIO CARD PATTERN - Clean, modern design following ResultsCard pattern
// ===============================================

import React from 'react';
import { Card } from '../../../components/layout';
import { Typography, TypographyColor } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Icon } from '../../../components/media/Icon/Icon';
import { EyeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { GB, SE } from 'country-flag-icons/react/3x2';
import './PortfolioCard.css';

// ===== TYPE DEFINITIONS =====

export interface PortfolioCardProps {
  className?: string;
  
  // Content
  category?: string;
  title: string;
  description: string;
  views?: string;
  videoSrc?: string; // Optional - either video or image
  imageSrc?: string; // Optional - either video or image
  flag?: 'uk' | 'sv'; // Optional flag for country/language indicator
  
  // Styling options
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
  
  // Typography variants
  categoryVariant?: 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs' | 'label-lg' | 'label-md' | 'label-sm';
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-xl' | 'body-lg' | 'body-md' | 'body-sm';
  descriptionVariant?: 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs';
  viewsVariant?: 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs' | 'label-lg' | 'label-md' | 'label-sm';
  
  // Typography weights
  categoryWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  titleWeight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  descriptionWeight?: 'regular' | 'medium' | 'semibold';
  viewsWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  
  // Typography colors
  categoryColor?: TypographyColor;
  titleColor?: TypographyColor;
  descriptionColor?: TypographyColor;
  viewsColor?: TypographyColor;
  
  // Layout spacing
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// ===== MAIN PORTFOLIO CARD COMPONENT =====

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  className,
  category,
  title,
  description,
  views,
  videoSrc,
  imageSrc,
  flag,
  
  // Card styling defaults
  variant = 'elevated',
  padding = 'md',
  radius = 'md',
  
  // Typography defaults - clean, modern style
  categoryVariant = 'body-xs',
  titleVariant = 'h5',
  descriptionVariant = 'body-sm',
  viewsVariant = 'body-xs',
  
  categoryWeight = 'medium',
  titleWeight = 'bold',
  descriptionWeight = 'regular',
  viewsWeight = 'regular',
  
  categoryColor = 'tertiary',
  titleColor = 'primary',
  descriptionColor = 'secondary',
  viewsColor = 'tertiary',
  
  // Layout defaults
  spacing = 'md'
}) => {
  // Determine if we have video or image content
  const hasVideo = Boolean(videoSrc);
  const hasImage = Boolean(imageSrc);
  
  return (
    <VStack spacing={spacing} className={`portfolio-card-wrapper ${className || ''}`}>
      {/* Media Card - Elevated background like ResultsCard */}
      <Card
        variant={variant}
        padding={padding}
        radius={radius}
        className="portfolio-media-card"
      >
        {/* Flag indicator - positioned absolutely */}
        {flag && (
          <HStack className="portfolio-flag">
            {flag === 'uk' && <GB />}
            {flag === 'sv' && <SE />}
          </HStack>
        )}
        
        {/* Video content */}
        {hasVideo && videoSrc && (
          <video
            src={videoSrc}
            className="portfolio-video"
            controls
            preload="metadata"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Image content */}
        {hasImage && !hasVideo && imageSrc && (
          <Image
            src={imageSrc}
            alt={title}
            width={400}
            height={300}
            className="portfolio-image"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover'
            }}
            priority
          />
        )}
      </Card>
      
      {/* Text Content - Similar to ResultsCard, no background */}
      <VStack spacing="sm" className="portfolio-text-content">
        {/* Category and Views Row */}
        {(category || views) && (
          <HStack spacing="sm" className="portfolio-meta">
            {category && (
              <Typography
                variant={categoryVariant}
                weight={categoryWeight}
                color={categoryColor}
                className="portfolio-category"
              >
                {category}
              </Typography>
            )}
            
            {views && (
              <HStack spacing="xs">
                <Icon size="xs" color="tertiary">
                  <EyeIcon />
                </Icon>
                <Typography
                  variant={viewsVariant}
                  weight={viewsWeight}
                  color={viewsColor}
                >
                  {views}
                </Typography>
              </HStack>
            )}
          </HStack>
        )}
        
        {/* Title */}
        <Typography
          variant={titleVariant}
          weight={titleWeight}
          color={titleColor}
        >
          {title}
        </Typography>
        
        {/* Description */}
        <Typography
          variant={descriptionVariant}
          weight={descriptionWeight}
          color={descriptionColor}
        >
          {description}
        </Typography>
      </VStack>
    </VStack>
  );
};

PortfolioCard.displayName = 'PortfolioCard';