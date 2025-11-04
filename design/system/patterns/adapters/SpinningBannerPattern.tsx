'use client';

import { SpinningBanner } from '../client/spinning-banner/SpinningBanner';

interface SpinningBannerPatternProps {
  type: string;
  components?: Record<string, {
    type: string;
    content: any;
  }>;
  settings?: {
    speed?: number;
    direction?: 'left' | 'right';
  };
  [key: string]: any;
}

export function SpinningBannerPattern({ components, settings, ...props }: SpinningBannerPatternProps) {
  if (!components) return null;

  // Extract logos
  const logos = Object.entries(components)
    .filter(([key, comp]: [string, any]) => comp.type === 'logo')
    .map(([key, comp]: [string, any]) => ({
      src: comp.content?.src || '',
      alt: comp.content?.alt || 'Logo'
    }))
    .filter(logo => logo.src);
  
  if (logos.length === 0) return null;

  return (
    <SpinningBanner
      logos={logos}
      speed={settings?.speed || 30}
      direction={settings?.direction || 'left'}
    />
  );
}