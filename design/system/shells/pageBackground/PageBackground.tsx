'use client';

import { PageProps } from '../../core/types/nodes';
import { renderBackgroundComponent } from '../../core/render/background';

interface PageBackgroundProps {
  pageProps?: PageProps;
  children: React.ReactNode;
}

/**
 * PageBackground - Renders optional page-level background with content
 * Used to add subtle textures, patterns, colors or images behind page content
 * 
 * Features:
 * - background: 'generative' | 'gradient' | 'pattern' | 'video' | 'image'
 * - backgroundColor: Solid color background
 * - backgroundImage: Image/pattern with configurable opacity
 * - backgroundOverlay: Color tint on top of image
 * - transparentSections: Makes child sections transparent (default: true)
 * - bottomBlur: Adds a fixed blur/gradient bar at the bottom of the screen
 */
export function PageBackground({ pageProps, children }: PageBackgroundProps) {
  const hasBackground = !!pageProps?.background || !!pageProps?.backgroundImage || !!pageProps?.backgroundColor;
  const showBottomBlur = !!pageProps?.bottomBlur;

  // Bottom blur variant presets - controls the max blur and height
  const bottomBlurPresets = {
    subtle: { height: 60, maxBlur: 6, layers: 6 },
    medium: { height: 80, maxBlur: 10, layers: 8 },
    strong: { height: 100, maxBlur: 14, layers: 8 },
    reflection: { height: 120, maxBlur: 20, layers: 8 },
  };

  // Render bottom blur helper - uses stacked blur technique for smooth effect
  const renderBottomBlurElement = () => {
    if (!showBottomBlur) return null;
    
    // Get variant or default to medium
    const variantKey = (typeof pageProps?.bottomBlur === 'string' 
      ? pageProps.bottomBlur 
      : 'medium') as keyof typeof bottomBlurPresets;
    
    const preset = bottomBlurPresets[variantKey] || bottomBlurPresets.medium;
    
    // Allow overrides via props
    const height = pageProps?.bottomBlurHeight ?? preset.height;
    const maxBlur = pageProps?.bottomBlurAmount ?? preset.maxBlur;
    const layerCount = preset.layers;
    
    // Generate stacked blur layers
    const layers = [];
    const step = 100 / layerCount; // percentage step for each layer
    
    for (let i = 0; i < layerCount; i++) {
      // Progressive blur: doubles each layer (like reference: 0.08 → 0.16 → 0.3 → 0.6 → 1.25 → 2.5 → 5 → 10)
      const blur = maxBlur / Math.pow(2, layerCount - 1 - i);
      
      // Calculate mask positions (each layer covers a band)
      const start = i * step;
      const solidStart = start + step * 0.5;
      const solidEnd = (i + 1) * step;
      const end = Math.min(solidEnd + step * 0.5, 100);
      
      layers.push(
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${height}px`,
            pointerEvents: 'none',
            zIndex: 9990 + i,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: `linear-gradient(to top, 
              rgba(0,0,0,0) ${start}%, 
              rgb(0,0,0) ${solidStart}%, 
              rgb(0,0,0) ${solidEnd}%, 
              rgba(0,0,0,0) ${end}%
            )`,
            WebkitMaskImage: `linear-gradient(to top, 
              rgba(0,0,0,0) ${start}%, 
              rgb(0,0,0) ${solidStart}%, 
              rgb(0,0,0) ${solidEnd}%, 
              rgba(0,0,0,0) ${end}%
            )`,
          }}
        />
      );
    }
    
    return <>{layers}</>;
  };

  // If no background but bottomBlur is enabled, still render it
  if (!hasBackground) {
    return (
      <>
        {children}
        {renderBottomBlurElement()}
      </>
    );
  }

  // Determine if sections should be transparent
  const shouldMakeSectionsTransparent = pageProps.transparentSections !== false;

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    isolation: 'isolate',
    minHeight: '100vh',
    // This CSS variable controls section backgrounds
    ...(shouldMakeSectionsTransparent && {
      '--section-background': 'transparent',
    }),
    // Apply background color to wrapper if set
    ...(pageProps.backgroundColor && {
      backgroundColor: pageProps.backgroundColor,
    }),
  } as React.CSSProperties;

  // Render dynamic background based on type
  const renderBackground = () => {
    const background = pageProps?.background;
    
    // Use helper for typed backgrounds
    if (background && background !== 'image' && pageProps) {
      const bgComponent = renderBackgroundComponent(background, pageProps);
      if (bgComponent) {
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            {bgComponent}
          </div>
        );
      }
    }
    
    // Legacy image background support
    if (background === 'image' || pageProps?.backgroundImage) {
      return (
        <>
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundImage: `url(${pageProps.backgroundImage})`,
              backgroundSize: pageProps.backgroundSize || 'auto',
              backgroundPosition: pageProps.backgroundPosition || 'center',
              backgroundRepeat: 'repeat',
              opacity: pageProps.backgroundOpacity ?? 0.03,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          {pageProps.backgroundOverlay && typeof pageProps.backgroundOverlay === 'string' && (
            <div
              aria-hidden="true"
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: pageProps.backgroundOverlay,
                opacity: pageProps.backgroundOverlayOpacity ?? 0.5,
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          )}
        </>
      );
    }
    
    return null;
  };

  return (
    <div style={wrapperStyle}>
      {renderBackground()}
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
      
      {/* Bottom blur bar */}
      {renderBottomBlurElement()}
    </div>
  );
}
