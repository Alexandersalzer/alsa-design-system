'use client';

import React from 'react';

export type IframePresetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'video' | 'calendar';

const PRESET_SIZES: Record<IframePresetSize, { width: string; height: string }> = {
  sm: { width: '100%', height: '400px' },
  md: { width: '100%', height: '600px' },
  lg: { width: '100%', height: '700px' },
  xl: { width: '100%', height: '800px' },
  full: { width: '100%', height: '100vh' },
  video: { width: '100%', height: '56.25%' }, // 16:9 aspect ratio
  calendar: { width: '100%', height: '700px' },
};

export interface IframeEmbedProps {
  /** URL to embed */
  src: string;
  /** Preset size or custom dimensions */
  size?: IframePresetSize;
  /** Custom width (overrides preset) */
  width?: string;
  /** Custom height (overrides preset) */
  height?: string;
  /** Border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg';
  /** Show border */
  border?: boolean;
  /** Border color */
  borderColor?: string;
  /** Title for accessibility */
  title?: string;
  /** Allow fullscreen */
  allowFullscreen?: boolean;
  /** Additional iframe attributes for permissions */
  allow?: string;
}

export const IframeEmbed: React.FC<IframeEmbedProps> = ({
  src,
  size = 'md',
  width,
  height,
  radius = 'md',
  border = false,
  borderColor = '#e0e0e0',
  title = 'Embedded content',
  allowFullscreen = false,
  allow,
}) => {
  const preset = PRESET_SIZES[size];
  const finalWidth = width || preset.width;
  const finalHeight = height || preset.height;

  const radiusMap = {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
  };

  return (
    <div
      style={{
        width: finalWidth,
        height: finalHeight,
        borderRadius: radiusMap[radius],
        overflow: 'hidden',
        border: border ? `1px solid ${borderColor}` : 'none',
        position: 'relative',
      }}
    >
      <iframe
        src={src}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        frameBorder="0"
        title={title}
        allowFullScreen={allowFullscreen}
        allow={allow}
      />
    </div>
  );
};
