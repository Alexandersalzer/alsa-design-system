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
import {
  GB, SE, DE, DK, US, NO, FI, FR, ES, IT, NL, BE, AT, CH, PL,
  CZ, RO, GR, PT, IE, HR, LT, LV, EE, SK, SI, BG, HU, LU, MT, CY
} from 'country-flag-icons/react/3x2';
import './PortfolioCard.css';

// ===== FLAG MAPPING =====
const FLAG_COMPONENTS: Record<string, any> = {
  // Nordic countries
  'se': SE, 'sweden': SE, 'sv': SE,
  'no': NO, 'norway': NO,
  'dk': DK, 'denmark': DK, 'da': DK,
  'fi': FI, 'finland': FI,

  // Major European countries
  'de': DE, 'germany': DE, 'german': DE,
  'gb': GB, 'uk': GB, 'united-kingdom': GB, 'england': GB, 'en': GB,
  'us': US, 'usa': US, 'america': US, 'united-states': US,
  'fr': FR, 'france': FR, 'french': FR,
  'es': ES, 'spain': ES, 'spanish': ES,
  'it': IT, 'italy': IT, 'italian': IT,
  'nl': NL, 'netherlands': NL, 'dutch': NL,
  'be': BE, 'belgium': BE,
  'at': AT, 'austria': AT,
  'ch': CH, 'switzerland': CH,
  'pl': PL, 'poland': PL, 'polish': PL,

  // Other European countries
  'cz': CZ, 'czech': CZ, 'czech-republic': CZ,
  'ro': RO, 'romania': RO, 'romanian': RO,
  'gr': GR, 'greece': GR, 'greek': GR,
  'pt': PT, 'portugal': PT, 'portuguese': PT,
  'ie': IE, 'ireland': IE, 'irish': IE,
  'hr': HR, 'croatia': HR, 'croatian': HR,
  'lt': LT, 'lithuania': LT, 'lithuanian': LT,
  'lv': LV, 'latvia': LV, 'latvian': LV,
  'ee': EE, 'estonia': EE, 'estonian': EE,
  'sk': SK, 'slovakia': SK, 'slovak': SK,
  'si': SI, 'slovenia': SI, 'slovenian': SI,
  'bg': BG, 'bulgaria': BG, 'bulgarian': BG,
  'hu': HU, 'hungary': HU, 'hungarian': HU,
  'lu': LU, 'luxembourg': LU,
  'mt': MT, 'malta': MT, 'maltese': MT,
  'cy': CY, 'cyprus': CY,
};

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
  posterSrc?: string; // Thumbnail URL for videos (derived from mediaSrc)
  countryCode?: string; // Country code for flag (e.g., 'se', 'us', 'de', 'dk', 'no', etc.)
  showFlags?: boolean; // Toggle flag visibility (default: true)
  
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
  posterSrc,
  countryCode,
  showFlags = true,

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

  // Get the flag component dynamically
  const FlagComponent = countryCode ? FLAG_COMPONENTS[countryCode.toLowerCase()] : null;

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
          {showFlags && countryCode && FlagComponent && (
            <div className="portfolio-flag">
              <FlagComponent />
            </div>
          )}

          {isVideo && (
            <>
              {posterSrc && console.log('[PortfolioCard] Video:', title, 'Poster:', posterSrc)}
              <Video
                src={mediaSrc}
                poster={posterSrc}
                aspectRatio="2/3"
                radius="sm"
                loading="lazy"
                rootMargin="800px"
                controlsList="nodownload"
                disablePictureInPicture
                className="portfolio-video"
              />
            </>
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