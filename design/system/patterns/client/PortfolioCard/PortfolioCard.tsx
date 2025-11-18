// ===============================================
// design/system/components/patterns/client/PortfolioCard/PortfolioCard.tsx
// PORTFOLIO CARD PATTERN - Video/Image portfolio card like KJ Marketing
// ===============================================

import React from 'react';
import { Card } from '../../../components/layout';
import { VideoShowcase } from '../../../components/media';
import { Typography, TypographyColor } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import Image from 'next/image';
import { GB, SE } from 'country-flag-icons/react/3x2';

// ===== TYPE DEFINITIONS =====

export interface PortfolioCardProps {
  className?: string;
  
  // Content
  category: string;
  title: string;
  description: string;
  views?: string; // Optional since some content might not have views
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
  // Determine if we have video or image content
  const hasVideo = Boolean(videoSrc);
  const hasImage = Boolean(imageSrc);
  
  return (
    <Card
      className={`portfolio-card ${className || ''}`}
      variant={variant}
      padding="sm" // Override to sm since media extends to edges
      radius={radius}
    >
      <VStack spacing={spacing}>
        {/* Media Container - extends to card edges */}
        <div className="portfolio-media-container">
          {/* Flag indicator - positioned absolutely in top-right corner */}
          {flag && (
            <div className="portfolio-flag">
              {flag === 'uk' && (
                <GB />
              )}
              {flag === 'sv' && (
                <SE />
              )}
            </div>
          )}
          
          {hasVideo && (
            <VideoShowcase
              src={videoSrc} // Remove automatic /videos/portfolio/ prefix
              variant="elevated"
              size="full"
              aspectRatio="auto"
              radius="none" // No radius since we handle it in CSS
              showPlayButton={true}
              controls={false}
              autoPlay={false}
              muted={true}
              loop={true}
              playsInline={true}
            />
          )}
          
          {hasImage && !hasVideo && imageSrc && (
            <div className="portfolio-image-container">
              <Image
                src={imageSrc} // Remove automatic /images/portfolio/ prefix
                alt={title}
                width={400}
                height={240}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                priority
              />
            </div>
          )}
        </div>
        
        {/* Content - with padding */}
        <div className="portfolio-content">
          <VStack spacing="sm">
            {/* Category */}
            <Typography
              variant={categoryVariant}
              weight={categoryWeight}
              color={categoryColor}
              align="left"
            >
              {category}
            </Typography>
            
            {/* Title */}
            <Typography
              variant={titleVariant}
              weight={titleWeight}
              color={titleColor}
              align="left"
            >
              {title}
            </Typography> 
            {/* Description */}
            <Typography
              variant={descriptionVariant}
              weight={descriptionWeight}
              color={descriptionColor}
              align="left"
            >
              {description}
            </Typography>       
            {/* Views with Eye Icon - only show if views exist */}
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
                  {views}
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