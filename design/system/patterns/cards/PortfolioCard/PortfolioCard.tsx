// ===============================================
// design/system/components/patterns/client/PortfolioCard/PortfolioCard.tsx
// PORTFOLIO CARD PATTERN - Video/Image portfolio card like KJ Marketing
// ===============================================

import React, { useRef, useEffect, useState } from 'react';
import { Card } from '../../../components/layout';
import { Typography, TypographyColor } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import Image from 'next/image';
import { GB, SE } from 'country-flag-icons/react/3x2';
import './PortfolioCard.css';

// ===== TYPE DEFINITIONS =====

export interface PortfolioCardProps {
  className?: string;
  
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Determine if we have video or image content based on mediaType
  const isVideo = mediaType === 'video';
  const isImage = mediaType === 'image';

  // Track if video has been loaded once - then keep it loaded
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Once intersecting, mark as loaded and keep it
          if (entry.isIntersecting) {
            setIsIntersecting(true);
          }
        });
      },
      {
        rootMargin: '200px', // Load earlier for smoother experience
        threshold: 0.01
      }
    );

    observer.observe(videoRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVideo]);

  // Handle video errors
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;
    
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          console.debug('Video load aborted by user:', mediaSrc);
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          console.warn('Network error loading video:', mediaSrc);
          setVideoError(true);
          break;
        case MediaError.MEDIA_ERR_DECODE:
          console.warn('Video decode error:', mediaSrc);
          setVideoError(true);
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          console.warn('Video format not supported or CORS issue:', mediaSrc);
          setVideoError(true);
          break;
        default:
          console.warn('Unknown video error:', mediaSrc, error);
          setVideoError(true);
      }
    } else {
      console.warn('Video error without error object:', mediaSrc, e);
      setVideoError(true);
    }
  };

  const handleVideoAbort = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.debug('Video load aborted (normal):', mediaSrc);
  };

  const handleVideoStalled = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.debug('Video stalled:', mediaSrc);
  };

  return (
    <Card
      className={`portfolio-card ${className || ''}`}
      variant={variant}
      padding="sm"
      radius={radius}
    >
      <VStack spacing={spacing}>
        <div className="portfolio-media-container">
          {countryCode && (
            <div className="portfolio-flag">
              {countryCode.toLowerCase() === 'uk' && <GB />}
              {countryCode.toLowerCase() === 'sv' && <SE />}
            </div>
          )}
          
          {isVideo && !videoError && (
            <div className="portfolio-video-container">
              <video
                ref={videoRef}
                className="portfolio-video"
                src={isIntersecting ? `${mediaSrc}#t=0.1` : undefined}
                preload={isIntersecting ? "metadata" : "none"}
                playsInline
                controls
                onError={handleVideoError}
                onAbort={handleVideoAbort}
                onStalled={handleVideoStalled}
                controlsList="nodownload"
                disablePictureInPicture
                {...(typeof window !== 'undefined' && !window.location.hostname.includes('localhost') 
                  ? { crossOrigin: 'anonymous' as const } 
                  : {})}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {isVideo && videoError && (
            <div className="portfolio-video-container" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: '#f0f0f0',
              minHeight: '240px'
            }}>
              <Typography variant="body-sm" color="secondary" align="center">
                Video not available
              </Typography>
            </div>
          )}
          
          {isImage && (
            <div className="portfolio-image-container">
              <Image
                src={mediaSrc}
                alt={mediaAlt || title}
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