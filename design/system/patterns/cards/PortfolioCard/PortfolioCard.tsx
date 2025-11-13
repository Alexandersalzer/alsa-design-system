import React from 'react';
import { Card, VStack, HStack, Typography } from '../../../components';
import { CDN_BASE_URL } from '../../../core/utils/helpers';
import './PortfolioCard.css';

export interface PortfolioCardProps {
  title: string;
  description?: string;
  mediaType: 'image' | 'video';
  mediaSrc: string;
  mediaAlt?: string;
  views?: number;
  category?: string;
  countryCode?: string; // ISO country code for flag (e.g., 'SE', 'US', 'GB')
}


// Country code to flag emoji mapping
const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export function PortfolioCard({ 
  title, 
  description,
  mediaType,
  mediaSrc,
  mediaAlt = 'Portfolio item',
  views,
  category,
  countryCode
}: PortfolioCardProps) {
  return (
    <Card variant="outlined" className="portfolio-card">
      {/* Media Container - Full bleed at top */}
      <div className="portfolio-media-container">
        {countryCode && (
          <div className="portfolio-flag" title={countryCode}>
            <span role="img" aria-label={`${countryCode} flag`}>
              {getCountryFlag(countryCode)}
            </span>
          </div>
        )}

        {mediaType === 'video' ? (
          <div className="portfolio-video-container">
            <video
              src={`${CDN_BASE_URL}${mediaSrc}`}
              className="portfolio-video"
              controls
              preload="metadata"
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="portfolio-image-container">
            <img 
              src={`${CDN_BASE_URL}${mediaSrc}`}
              alt={mediaAlt}
              className="portfolio-image"
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="portfolio-content">
        <VStack spacing="sm">
          {/* Category tag if provided */}
          {category && (
            <Typography variant="body-xs" weight="medium" color="tertiary" className="portfolio-category">
              {category}
            </Typography>
          )}

          {/* Title */}
          <Typography variant="h5" weight="bold" color="primary">
            {title}
          </Typography>

          {/* Description */}
          {description && (
            <Typography variant="body-sm" weight="regular" color="secondary">
              {description}
            </Typography>
          )}

          {/* Views count */}
          {views !== undefined && (
            <HStack spacing="xs" className="portfolio-views">
              <span className="eye-icon" aria-label="Views">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
              </span>
              <Typography variant="body-xs" weight="regular" color="secondary">
                {views.toLocaleString()}
              </Typography>
            </HStack>
          )}
        </VStack>
      </div>
    </Card>
  );
}
