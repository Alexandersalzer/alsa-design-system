// ===============================================
// design/system/components/patterns/client/PortfolioCard/PortfolioCard.tsx
// PORTFOLIO CARD - Instant thumbnail loading, lazy video loading
// ===============================================

import React, { useRef, useEffect, useState } from 'react';
import { Card } from '../../../components/layout';
import { Typography, TypographyColor } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Image as CustomImage } from '../../../components/media/Image/Image';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const isVideo = mediaType === 'video';
  const isImage = mediaType === 'image';

  // ✅ STEP 1: Generate thumbnail immediately on mount (for videos)
  useEffect(() => {
    if (!isVideo) return;

    const generateThumbnail = async () => {
      try {
        // Create a hidden video element to capture thumbnail
        const video = document.createElement('video');
        video.src = `${mediaSrc}#t=0.5`; // Seek to 0.5s for better frame
        video.crossOrigin = 'anonymous';
        video.preload = 'metadata';
        video.muted = true;

        // Wait for video to load metadata
        await new Promise<void>((resolve, reject) => {
          video.onloadeddata = () => resolve();
          video.onerror = () => reject(new Error('Failed to load video'));
          
          // Timeout after 3 seconds
          setTimeout(() => reject(new Error('Thumbnail generation timeout')), 3000);
        });

        // Seek to get a frame
        video.currentTime = 0.5;

        await new Promise<void>((resolve) => {
          video.onseeked = () => resolve();
        });

        // Draw frame to canvas
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to data URL
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          setThumbnail(thumbnailUrl);
        }

        // Cleanup
        video.remove();
      } catch (error) {
        console.warn('Thumbnail generation failed, will use video poster:', error);
        // Fallback: use video itself as poster
        setThumbnail(null);
      }
    };

    generateThumbnail();
  }, [isVideo, mediaSrc]);

  // ✅ STEP 2: Intersection observer to load video only when visible
  useEffect(() => {
    if (!isVideo || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoVisible(true);
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0.01
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVideo]);

  // Handle click to show video player
  const handleThumbnailClick = () => {
    if (isVideo && !showVideo) {
      setShowVideo(true);
    }
  };

  // Handle video errors
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.warn('Video error:', mediaSrc, e);
    setVideoError(true);
  };

  return (
    <Card
      className={`portfolio-card ${className || ''}`}
      variant={variant}
      padding="sm"
      radius={radius}
    >
      <VStack spacing={spacing}>
        <div 
          ref={containerRef}
          className="portfolio-media-container"
          onClick={handleThumbnailClick}
          style={{ cursor: isVideo && !showVideo ? 'pointer' : 'default' }}
        >
          {countryCode && (
            <div className="portfolio-flag">
              {countryCode.toLowerCase() === 'uk' && <GB />}
              {countryCode.toLowerCase() === 'sv' && <SE />}
            </div>
          )}
          
          {/* ✅ Show thumbnail for videos (instant display) */}
          {isVideo && !showVideo && (
            <div className="portfolio-video-thumbnail">
              {thumbnail ? (
                <CustomImage
                  src={thumbnail}
                  alt={mediaAlt || title}
                  width="100%"
                  height="auto"
                  aspectRatio="16/9"
                  objectFit="cover"
                  priority
                  showSkeleton={false}
                  className="portfolio-thumbnail-image"
                />
              ) : (
                <video
                  className="portfolio-video-poster"
                  src={`${mediaSrc}#t=0.1`}
                  preload="metadata"
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              )}
              
              {/* Play button overlay */}
              <div className="portfolio-play-overlay">
                <svg 
                  width="64" 
                  height="64" 
                  viewBox="0 0 64 64" 
                  fill="none"
                  className="portfolio-play-icon"
                >
                  <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.7)" />
                  <path 
                    d="M26 20L44 32L26 44V20Z" 
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* ✅ Show actual video player when clicked (lazy loaded) */}
          {isVideo && showVideo && isVideoVisible && !videoError && (
            <div className="portfolio-video-container">
              <video
                ref={videoRef}
                className="portfolio-video"
                src={mediaSrc}
                preload="auto"
                playsInline
                controls
                autoPlay
                onError={handleVideoError}
                controlsList="nodownload"
                disablePictureInPicture
                crossOrigin="anonymous"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Error state */}
          {isVideo && videoError && (
            <div className="portfolio-video-error">
              <Typography variant="body-sm" color="secondary" align="center">
                Video not available
              </Typography>
            </div>
          )}
          
          {/* Regular images */}
          {isImage && (
            <div className="portfolio-image-container">
              <CustomImage
                src={mediaSrc}
                alt={mediaAlt || title}
                width="100%"
                height="auto"
                aspectRatio="16/9"
                objectFit="cover"
                priority
                showSkeleton={true}
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