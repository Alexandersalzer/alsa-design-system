// ===============================================
// design/system/patterns/client/feature-grid/feature-grid.tsx
// FEATURE GRID PATTERN - Universal grid with multiple variants
// Variants: mixed (default), cards, images, videos, stats
// ===============================================
'use client';

import React from 'react';
import { Grid } from '../../../components/layout/grid/Grid';
import { Card } from '../../../components/layout';
import { Typography } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Icon } from '../../../components/media/Icon/Icon';
import Image from 'next/image';

// Import heroicons
import { 
  CheckCircleIcon, BoltIcon, ShieldCheckIcon, StarIcon, SparklesIcon,
  RocketLaunchIcon, ChartBarIcon, CurrencyDollarIcon,
  EyeIcon, UsersIcon, HeartIcon, FireIcon
} from '@heroicons/react/24/outline';

// ===== COMPONENT TYPE DEFINITIONS =====

// For variant="mixed" - All types available
export interface StatCardComponent {
  type: 'statCard';
  subtitle: string;
  title: string;
  body: string;
  image?: string;
}

export interface ImageCardComponent {
  type: 'imageCard';
  title?: string;
  body?: string;
  image: string;
  alt: string;
  aspectRatio?: '1-1' | '16-9' | '4-3' | '3-2';
}

export interface VideoCardComponent {
  type: 'videoCard';
  title?: string;
  body?: string;
  video: string;
  poster?: string;
  duration?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export interface IconCardComponent {
  type: 'iconCard';
  title: string;
  body: string;
  icon: 'check' | 'bolt' | 'shield' | 'star' | 'sparkles' | 'rocket' | 'chart' | 'dollar' | 'trending' | 'eye' | 'users' | 'heart' | 'fire';
  iconColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

export interface TextCardComponent {
  type: 'textCard';
  title: string;
  body: string;
  subtitle?: string;
}

// For variant="cards"
export interface CardComponent {
  type: 'card';
  title: string;
  body: string;
  subtitle?: string;
  icon?: 'check' | 'bolt' | 'shield' | 'star' | 'sparkles' | 'rocket' | 'chart' | 'dollar' | 'trending' | 'eye' | 'users' | 'heart' | 'fire';
  iconColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

// For variant="images"
export interface ImageComponent {
  type: 'image';
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  aspectRatio?: '1-1' | '16-9' | '4-3' | '3-2';
}

// For variant="videos"
export interface VideoComponent {
  type: 'video';
  src: string;
  poster?: string;
  title?: string;
  description?: string;
  duration?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

// For variant="stats"
export interface StatComponent {
  type: 'stat';
  value: string;
  label: string;
  description?: string;
  icon?: 'check' | 'bolt' | 'shield' | 'star' | 'sparkles' | 'rocket' | 'chart' | 'dollar' | 'trending' | 'eye' | 'users' | 'heart' | 'fire';
  iconColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  prefix?: string;
  suffix?: string;
}

// Union type of all possible components
export type FeatureGridComponent = 
  | StatCardComponent 
  | ImageCardComponent 
  | VideoCardComponent 
  | IconCardComponent 
  | TextCardComponent
  | CardComponent
  | ImageComponent
  | VideoComponent
  | StatComponent;

// ===== PATTERN PROPS =====
export interface FeatureGridPatternProps {
  // ===== NEW: JSON STRUCTURE SUPPORT =====
  type?: string;
  components?: Record<string, FeatureGridComponent>;
  props?: {
    variant?: 'mixed' | 'cards' | 'images' | 'videos' | 'stats';
    columns?: {
      base?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      '2xl'?: number;
    };
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    cardVariant?: 'default' | 'elevated' | 'outlined';
    padding?: 'sm' | 'md' | 'lg';
    alignment?: 'left' | 'center';
    // Variant-specific props
    showCaptions?: boolean; // For images
    showInfo?: boolean; // For videos
    aspectRatio?: '1-1' | '16-9' | '4-3' | '3-2' | 'auto'; // For images
    size?: 'compact' | 'default' | 'large'; // For stats
    autoPlay?: boolean; // For videos
    muted?: boolean; // For videos
    loop?: boolean; // For videos
    controls?: boolean; // For videos
  };
  
  // ===== LEGACY PROPS =====
  variant?: 'mixed' | 'cards' | 'images' | 'videos' | 'stats';
  items?: FeatureGridComponent[];
  columns?: any;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// ===== DEFAULT COLUMN CONFIGS BY VARIANT =====
const defaultColumns = {
  mixed: { base: 1, sm: 1, md: 2, lg: 3 },
  cards: { base: 1, sm: 2, md: 3 },
  images: { base: 1, sm: 2, md: 3, lg: 4 },
  videos: { base: 1, sm: 2, md: 2, lg: 3 },
  stats: { base: 1, sm: 2, md: 4 },
};

// ===== ASPECT RATIO MAPPING =====
const aspectRatioMap = {
  '1-1': '1 / 1',
  '16-9': '16 / 9',
  '4-3': '4 / 3',
  '3-2': '3 / 2',
  'auto': 'auto'
};

// ===== SIZE CONFIG FOR STATS =====
const sizeConfig = {
  compact: {
    valueVariant: 'h4' as const,
    labelVariant: 'body-sm' as const,
    descriptionVariant: 'body-xs' as const,
    padding: 'md' as const,
  },
  default: {
    valueVariant: 'h3' as const,
    labelVariant: 'body-md' as const,
    descriptionVariant: 'body-sm' as const,
    padding: 'lg' as const,
  },
  large: {
    valueVariant: 'h2' as const,
    labelVariant: 'body-lg' as const,
    descriptionVariant: 'body-md' as const,
    padding: 'lg' as const,
  },
};

// ===== ICON MAPPING =====
const iconMap = {
  'check': CheckCircleIcon,
  'bolt': BoltIcon,
  'shield': ShieldCheckIcon,
  'star': StarIcon,
  'sparkles': SparklesIcon,
  'rocket': RocketLaunchIcon,
  'chart': ChartBarIcon,
  'dollar': CurrencyDollarIcon,
  'trending': ChartBarIcon,
  'eye': EyeIcon,
  'users': UsersIcon,
  'heart': HeartIcon,
  'fire': FireIcon,
};

// ===== CARD RENDERERS =====

// Mixed variant renderers
const StatCard: React.FC<StatCardComponent> = ({ subtitle, title, body, image }) => (
  <Card variant="default" padding="md" radius="md">
    <VStack spacing="sm">
      {image && (
        <div className="feature-image-container">
          <Image
            src={`/images/results/${image}`}
            alt={title}
            width={500}
            height={300}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            priority
          />
        </div>
      )}
      <VStack spacing="xs">
        <Typography variant="body-lg" weight="regular" color="secondary" align="left">
          {subtitle}
        </Typography>
        <Typography variant="h4" weight="bold" color="primary" align="left">
          {title}
        </Typography>
        <Typography variant="body-md" weight="regular" color="secondary" align="left">
          {body}
        </Typography>
      </VStack>
    </VStack>
  </Card>
);

const ImageCard: React.FC<ImageCardComponent> = ({ title, body, image, alt }) => (
  <Card variant="default" padding="md" radius="md">
    <VStack spacing="sm">
      <div className="feature-image-container">
        <Image
          src={image}
          alt={alt}
          width={500}
          height={400}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {(title || body) && (
        <VStack spacing="xs">
          {title && (
            <Typography variant="h4" weight="bold" color="primary" align="left">
              {title}
            </Typography>
          )}
          {body && (
            <Typography variant="body-md" weight="regular" color="secondary" align="left">
              {body}
            </Typography>
          )}
        </VStack>
      )}
    </VStack>
  </Card>
);

const VideoCard: React.FC<VideoCardComponent> = ({ title, body, video, poster }) => (
  <Card variant="default" padding="md" radius="md">
    <VStack spacing="sm">
      <div className="feature-video-container">
        <video
          src={video}
          poster={poster}
          controls
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {(title || body) && (
        <VStack spacing="xs">
          {title && (
            <Typography variant="h4" weight="bold" color="primary" align="left">
              {title}
            </Typography>
          )}
          {body && (
            <Typography variant="body-md" weight="regular" color="secondary" align="left">
              {body}
            </Typography>
          )}
        </VStack>
      )}
    </VStack>
  </Card>
);

const IconCard: React.FC<IconCardComponent> = ({ title, body, icon, iconColor = 'accent' }) => {
  const IconComponent = iconMap[icon];
  
  return (
    <Card variant="default" padding="lg" radius="md">
      <VStack spacing="md" align="center">
        <div className="feature-icon">
          <Icon size="lg" color={iconColor}>
            <IconComponent />
          </Icon>
        </div>
        <VStack spacing="xs" align="center">
          <Typography variant="h4" weight="bold" color="primary" align="center">
            {title}
          </Typography>
          <Typography variant="body-md" weight="regular" color="secondary" align="center">
            {body}
          </Typography>
        </VStack>
      </VStack>
    </Card>
  );
};

const TextCard: React.FC<TextCardComponent> = ({ subtitle, title, body }) => (
  <Card variant="default" padding="lg" radius="md">
    <VStack spacing="sm">
      {subtitle && (
        <Typography variant="body-sm" weight="medium" color="accent" align="left">
          {subtitle}
        </Typography>
      )}
      <Typography variant="h4" weight="bold" color="primary" align="left">
        {title}
      </Typography>
      <Typography variant="body-md" weight="regular" color="secondary" align="left">
        {body}
      </Typography>
    </VStack>
  </Card>
);

// Cards variant renderer
const SimpleCard: React.FC<CardComponent & { variant: string; padding: 'sm' | 'md' | 'lg'; alignment: string }> = ({ 
  subtitle, title, body, icon, iconColor = 'accent', variant, padding, alignment 
}) => {
  const IconComponent = icon ? iconMap[icon] : null;
  
  return (
    <Card variant={variant as any} padding={padding} radius="md">
      <VStack spacing="md" align={alignment === 'center' ? 'center' : 'start'}>
        {IconComponent && (
          <div className="card-icon">
            <Icon size="lg" color={iconColor}>
              <IconComponent />
            </Icon>
          </div>
        )}
        <VStack spacing="xs" align={alignment === 'center' ? 'center' : 'start'}>
          {subtitle && (
            <Typography variant="body-sm" weight="medium" color="accent" align={alignment as any}>
              {subtitle}
            </Typography>
          )}
          <Typography variant="h4" weight="bold" color="primary" align={alignment as any}>
            {title}
          </Typography>
          <Typography variant="body-md" weight="regular" color="secondary" align={alignment as any}>
            {body}
          </Typography>
        </VStack>
      </VStack>
    </Card>
  );
};

// Images variant renderer
const GalleryImage: React.FC<ImageComponent & { 
  variant: string; 
  showCaptions: boolean;
  globalAspectRatio: string;
}> = ({ src, alt, title, caption, aspectRatio, variant, showCaptions, globalAspectRatio }) => {
  const finalAspectRatio = aspectRatio || globalAspectRatio;
  
  return (
    <Card variant={variant as any} padding="md" radius={variant === 'rounded' ? 'lg' : 'md'}>
      <VStack spacing="sm">
        <div 
          className="image-grid-item"
          style={{
            aspectRatio: aspectRatioMap[finalAspectRatio as keyof typeof aspectRatioMap],
            overflow: 'hidden',
            position: 'relative',
            width: '100%'
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {showCaptions && (title || caption) && (
          <VStack spacing="xs">
            {title && (
              <Typography variant="body-lg" weight="semibold" color="primary" align="left">
                {title}
              </Typography>
            )}
            {caption && (
              <Typography variant="body-sm" weight="regular" color="secondary" align="left">
                {caption}
              </Typography>
            )}
          </VStack>
        )}
      </VStack>
    </Card>
  );
};

// Videos variant renderer
const GalleryVideo: React.FC<VideoComponent & { 
  variant: string; 
  showInfo: boolean;
  globalAutoPlay: boolean;
  globalMuted: boolean;
  globalLoop: boolean;
  globalControls: boolean;
}> = ({ 
  src, poster, title, description, duration, autoPlay, muted, loop, controls,
  variant, showInfo, globalAutoPlay, globalMuted, globalLoop, globalControls
}) => {
  const finalAutoPlay = autoPlay !== undefined ? autoPlay : globalAutoPlay;
  const finalMuted = muted !== undefined ? muted : globalMuted;
  const finalLoop = loop !== undefined ? loop : globalLoop;
  const finalControls = controls !== undefined ? controls : globalControls;

  return (
    <Card variant={variant as any} padding="md" radius="md">
      <VStack spacing="sm">
        <div 
          className="video-grid-item"
          style={{
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
            backgroundColor: 'var(--color-surface-secondary)'
          }}
        >
          <video
            src={src}
            poster={poster}
            autoPlay={finalAutoPlay}
            muted={finalMuted}
            loop={finalLoop}
            controls={finalControls}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {duration && (
            <div 
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                padding: '4px 8px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: 'var(--radius-sm)',
                color: 'white',
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              {duration}
            </div>
          )}
        </div>
        {showInfo && (title || description) && (
          <VStack spacing="xs">
            {title && (
              <Typography variant="body-lg" weight="semibold" color="primary" align="left">
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="body-sm" weight="regular" color="secondary" align="left">
                {description}
              </Typography>
            )}
          </VStack>
        )}
      </VStack>
    </Card>
  );
};

// Stats variant renderer
const StatCard_Variant: React.FC<StatComponent & { 
  variant: string; 
  size: string;
  alignment: string;
}> = ({ 
  value, label, description, icon, iconColor = 'accent', trend, prefix, suffix,
  variant, size, alignment
}) => {
  const config = sizeConfig[size as keyof typeof sizeConfig];
  const alignProp = alignment === 'center' ? 'center' : 'start';
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <Card variant={variant as any} padding={config.padding} radius="md">
      <VStack spacing="sm" align={alignProp}>
        {(IconComponent || trend) && (
          <HStack justify="between" align="center" wrap={false}>
            {IconComponent && (
              <div className="stat-icon">
                <Icon size="md" color={iconColor}>
                  <IconComponent />
                </Icon>
              </div>
            )}
            {trend && (
              <div 
                className="stat-trend"
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                }}
              >
                <span 
                  style={{
                    color: trend.direction === 'up' 
                      ? 'var(--color-success)' 
                      : trend.direction === 'down' 
                      ? 'var(--color-error)' 
                      : 'var(--color-secondary)',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
                </span>
              </div>
            )}
          </HStack>
        )}

        <HStack spacing="xs" align="baseline" wrap={false}>
          {prefix && (
            <Typography variant="body-lg" weight="semibold" color="secondary" align={alignment as any}>
              {prefix}
            </Typography>
          )}
          <Typography variant={config.valueVariant} weight="bold" color="primary" align={alignment as any}>
            {value}
          </Typography>
          {suffix && (
            <Typography variant="body-lg" weight="semibold" color="secondary" align={alignment as any}>
              {suffix}
            </Typography>
          )}
        </HStack>

        <Typography variant={config.labelVariant} weight="medium" color="secondary" align={alignment as any}>
          {label}
        </Typography>

        {description && (
          <Typography variant={config.descriptionVariant} weight="regular" color="tertiary" align={alignment as any}>
            {description}
          </Typography>
        )}
      </VStack>
    </Card>
  );
};

// ===== MAIN FEATURE GRID PATTERN =====
export const FeatureGrid: React.FC<FeatureGridPatternProps> = ({
  // NEW: JSON Structure
  type,
  components,
  props: patternProps,
  // Legacy props
  variant: legacyVariant,
  items: legacyItems,
  columns: legacyColumns,
  gap: legacyGap,
  className
}) => {
  // ===== EXTRACT DATA FROM JSON COMPONENTS OR USE LEGACY PROPS =====
  
  let finalItems: FeatureGridComponent[];
  let finalVariant: 'mixed' | 'cards' | 'images' | 'videos' | 'stats';
  let finalColumns: any;
  let finalGap: any;
  let finalCardVariant: any;
  let finalPadding: 'sm' | 'md' | 'lg';
  let finalAlignment: any;
  let finalShowCaptions: boolean;
  let finalShowInfo: boolean;
  let finalAspectRatio: any;
  let finalSize: any;
  let finalAutoPlay: boolean;
  let finalMuted: boolean;
  let finalLoop: boolean;
  let finalControls: boolean;

  if (components) {
    // Extract from JSON structure
    finalItems = Object.values(components);
    finalVariant = patternProps?.variant || 'mixed';
    finalColumns = patternProps?.columns || defaultColumns[finalVariant];
    finalGap = patternProps?.gap || 'lg';
    finalCardVariant = patternProps?.cardVariant || 'elevated';
    finalPadding = (patternProps?.padding || 'lg') as 'sm' | 'md' | 'lg';
    finalAlignment = patternProps?.alignment || 'left';
    finalShowCaptions = patternProps?.showCaptions !== undefined ? patternProps.showCaptions : true;
    finalShowInfo = patternProps?.showInfo !== undefined ? patternProps.showInfo : true;
    finalAspectRatio = patternProps?.aspectRatio || '1-1';
    finalSize = patternProps?.size || 'default';
    finalAutoPlay = patternProps?.autoPlay || false;
    finalMuted = patternProps?.muted !== undefined ? patternProps.muted : true;
    finalLoop = patternProps?.loop || false;
    finalControls = patternProps?.controls !== undefined ? patternProps.controls : true;
  } else {
    // Use legacy props
    if (!legacyItems || legacyItems.length === 0) return null;
    finalItems = legacyItems;
    finalVariant = legacyVariant || 'mixed';
    finalColumns = legacyColumns || defaultColumns[finalVariant];
    finalGap = legacyGap || 'lg';
    finalCardVariant = 'elevated';
    finalPadding = 'lg';
    finalAlignment = 'left';
    finalShowCaptions = true;
    finalShowInfo = true;
    finalAspectRatio = '1-1';
    finalSize = 'default';
    finalAutoPlay = false;
    finalMuted = true;
    finalLoop = false;
    finalControls = true;
  }

  // Render based on variant and component type
  const renderComponent = (component: FeatureGridComponent, key: string) => {
    // Mixed variant - all types
    if (finalVariant === 'mixed') {
      switch (component.type) {
        case 'statCard':
          return <StatCard key={key} {...component} />;
        case 'imageCard':
          return <ImageCard key={key} {...component} />;
        case 'videoCard':
          return <VideoCard key={key} {...component} />;
        case 'iconCard':
          return <IconCard key={key} {...component} />;
        case 'textCard':
          return <TextCard key={key} {...component} />;
        default:
          console.warn(`Unknown component type for mixed variant: ${(component as any).type}`);
          return null;
      }
    }
    
    // Cards variant
    if (finalVariant === 'cards' && component.type === 'card') {
      return (
        <SimpleCard
          key={key}
          {...component}
          variant={finalCardVariant}
          padding={finalPadding}
          alignment={finalAlignment}
        />
      );
    }
    
    // Images variant
    if (finalVariant === 'images' && component.type === 'image') {
      return (
        <GalleryImage
          key={key}
          {...component}
          variant={finalCardVariant}
          showCaptions={finalShowCaptions}
          globalAspectRatio={finalAspectRatio}
        />
      );
    }
    
    // Videos variant
    if (finalVariant === 'videos' && component.type === 'video') {
      return (
        <GalleryVideo
          key={key}
          {...component}
          variant={finalCardVariant}
          showInfo={finalShowInfo}
          globalAutoPlay={finalAutoPlay}
          globalMuted={finalMuted}
          globalLoop={finalLoop}
          globalControls={finalControls}
        />
      );
    }
    
    // Stats variant
    if (finalVariant === 'stats' && component.type === 'stat') {
      return (
        <StatCard_Variant
          key={key}
          {...component}
          variant={finalCardVariant}
          size={finalSize}
          alignment={finalAlignment}
        />
      );
    }

    console.warn(`Component type "${(component as any).type}" doesn't match variant "${finalVariant}"`);
    return null;
  };

  const renderedItems = finalItems
    .map((component, index) => renderComponent(component, `item-${index}`))
    .filter(Boolean);

  if (renderedItems.length === 0) return null;

  return (
    <Grid
      columns={finalColumns}
      gap={finalGap}
      className={className || `feature-grid feature-grid--${finalVariant}`}
    >
      {renderedItems}
    </Grid>
  );
};

FeatureGrid.displayName = 'FeatureGrid';

export default FeatureGrid;