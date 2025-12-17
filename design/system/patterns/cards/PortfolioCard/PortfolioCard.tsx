// ===============================================
// design/system/components/patterns/client/PortfolioCard/PortfolioCard.tsx
// PORTFOLIO CARD PATTERN - Using Video component with cache detection
// ===============================================

import React from 'react';
import { Card } from '../../../components/layout';
import { Typography, TypographyColor } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Video } from '../../../components/media/Video';
import { Image } from '../../../components/media/Image';
import { GB, SE } from 'country-flag-icons/react/3x2';
import './PortfolioCard.css';

// ===== TYPE DEFINITIONS =====

export interface PortfolioCardProps {
  className?: string;
  componentKey?: string;
  
  // Content
  category?: string | string[]; // Array or single string
  title: string;
  description?: string;
  views?: number | string;
  mediaType: 'image' | 'video'; // Required - determines media type
  mediaSrc: string; // Required - single source for either video or image
  mediaAlt?: string; // Alt text for accessibility
  countryCode?: string; // Country code for flag (e.g., 'uk', 'sv')
  
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
  componentKey,
  category,
  title,
  description,
  views,
  mediaType,
  mediaSrc,
  mediaAlt,
  countryCode,
  
  // Card styling defaults
  variant = 'default',
  padding = 'md',
  radius = 'md',
  
  // Typography defaults - matching KJ Marketing style
  categoryVariant = 'label-sm',
  titleVariant = 'h4',
  descriptionVariant = 'body-sm',
  viewsVariant = 'label-sm',
  
  categoryWeight = 'medium',
  titleWeight = 'bold',
  descriptionWeight = 'regular',
  viewsWeight = 'medium',
  
  categoryColor = 'secondary',
  titleColor = 'primary',
  descriptionColor = 'primary',
  viewsColor = 'secondary',
  
  // Layout defaults
  spacing = 'sm'
}) => {
  const isVideo = mediaType === 'video';
  const isImage = mediaType === 'image';

  return (
    <Card
      className={`portfolio-card ${className || ''}`}
      variant={variant}
      padding="sm"
      radius={radius}
      data-component-key={componentKey}
    >
      <VStack spacing={spacing}>
        <div className="portfolio-media-container">
          {countryCode && (
            <div className="portfolio-flag">
              {countryCode.toLowerCase() === 'uk' && <GB />}
              {countryCode.toLowerCase() === 'sv' && <SE />}
            </div>
          )}
          
          {isVideo && (
            <Video
              src={mediaSrc}
              aspectRatio="2/3"
              radius="sm"
              loading="lazy"
              rootMargin="800px"
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload"
              disablePictureInPicture
              className="portfolio-video"
            />
          )}
          
          {isImage && (
            <Image
              src={mediaSrc}
              alt={mediaAlt || title}
              aspectRatio="2/3"
              objectFit="cover"
              radius="sm"
              loading="lazy"
              rootMargin="800px"
              showSkeleton={true}
              priority={false}
              className="portfolio-image"
            />
          )}
        </div>
        
        <div className="portfolio-content">
          <VStack spacing="sm">
            {category && (
              <Typography
                variant={categoryVariant}
                weight={categoryWeight}
                color={categoryColor}
                align="left"
              >
                {Array.isArray(category) ? category[0] : category}
              </Typography>
            )}
            
            <Typography
              variant={titleVariant}
              weight={titleWeight}
              color={titleColor}
              align="left"
            >
              {title}
            </Typography>
            
            {description && (
              <Typography
                variant={descriptionVariant}
                weight={descriptionWeight}
                color={descriptionColor}
                align="left"
              >
                {description}
              </Typography>
            )}
            
            {views && (
              <HStack spacing="xs" align="center">
                <div className="eye-icon">
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <Typography
                  variant={viewsVariant}
                  weight={viewsWeight}
                  color={viewsColor}
                  align="left"
                >
                  {typeof views === 'number' ? views.toLocaleString() : views}
                </Typography>
              </HStack>
            )}
          </VStack>
        </div>
      </VStack>
    </Card>
  );
};

PortfolioCard.displayName = 'PortfolioCard';