'use client';

import React from 'react';
import { VideoShowcase } from '../../../components/media/VideoShowcase/VideoShowcase';

interface MediaPatternProps {
  // ===== NEW: JSON STRUCTURE SUPPORT =====
  type?: string;
  components?: Record<string, {
    type: string;
    content: any;
  }>;
  
  // ===== LEGACY PROPS =====
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  showPlayButton?: boolean;
  variant?: 'default' | 'rounded' | 'elevated';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  aspectRatio?: '16-9' | '4-3' | '1-1' | 'auto';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const MediaPattern: React.FC<MediaPatternProps> = ({
  // NEW: JSON Structure
  type,
  components,
  
  // Legacy props
  src: legacySrc,
  poster: legacyPoster,
  autoPlay: legacyAutoPlay,
  muted: legacyMuted,
  loop: legacyLoop,
  controls: legacyControls,
  showPlayButton: legacyShowPlayButton,
  variant: legacyVariant,
  size: legacySize,
  aspectRatio: legacyAspectRatio,
  radius: legacyRadius,
  className
}) => {
  // ===== EXTRACT DATA FROM JSON COMPONENTS OR USE LEGACY PROPS =====
  let src: string;
  let poster: string;
  let autoPlay: boolean;
  let muted: boolean;
  let loop: boolean;
  let controls: boolean;
  let showPlayButton: boolean;
  let variant: 'default' | 'rounded' | 'elevated';
  let size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  let aspectRatio: '16-9' | '4-3' | '1-1' | 'auto';
  let radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  if (components) {
    // Extract video component from JSON structure
    const videoComponent = Object.values(components).find((c: any) => c.type === 'video') as any;
    
    if (!videoComponent?.content?.src) {
      return null;
    }

    // Map JSON data to component props
    src = videoComponent.content.src;
    poster = videoComponent.content.poster || '';
    autoPlay = videoComponent.content.autoPlay || false;
    muted = videoComponent.content.muted !== undefined ? videoComponent.content.muted : true;
    loop = videoComponent.content.loop !== undefined ? videoComponent.content.loop : true;
    controls = videoComponent.content.controls || false;
    showPlayButton = videoComponent.content.showPlayButton !== undefined ? videoComponent.content.showPlayButton : true;
    variant = videoComponent.content.variant || 'elevated';
    size = videoComponent.content.size || 'full';
    aspectRatio = videoComponent.content.aspectRatio || '16-9';
    radius = videoComponent.content.radius || 'md';
  } else {
    // Use legacy props with defaults
    if (!legacySrc) return null;
    
    src = legacySrc;
    poster = legacyPoster || '';
    autoPlay = legacyAutoPlay || false;
    muted = legacyMuted !== undefined ? legacyMuted : true;
    loop = legacyLoop !== undefined ? legacyLoop : true;
    controls = legacyControls || false;
    showPlayButton = legacyShowPlayButton !== undefined ? legacyShowPlayButton : true;
    variant = legacyVariant || 'elevated';
    size = legacySize || 'full';
    aspectRatio = legacyAspectRatio || '16-9';
    radius = legacyRadius || 'md';
  }

  return (
    <VideoShowcase
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      showPlayButton={showPlayButton}
      variant={variant}
      size={size}
      aspectRatio={aspectRatio}
      radius={radius}
      className={className}
    />
  );
};