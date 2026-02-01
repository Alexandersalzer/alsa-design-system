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

  // Bottom blur variant presets
  const bottomBlurPresets = {
    subtle: {
      height: 40,
      blur: 4,
      tint: 0.05,
      brightness: 0.98,
      maskStrength: 0.5,
    },
    medium: {
      height: 60,
      blur: 8,
      tint: 0.1,
      brightness: 0.96,
      maskStrength: 0.7,
    },
    strong: {
      height: 80,
      blur: 12,
      tint: 0.18,
      brightness: 0.92,
      maskStrength: 0.9,
    },
  };

  // Render bottom blur helper (defined early so it can be used in early return)
  const renderBottomBlurElement = () => {
    if (!showBottomBlur) return null;
    
    // Get variant or default to medium
    const variantKey = (typeof pageProps?.bottomBlur === 'string' 
      ? pageProps.bottomBlur 
      : 'medium') as keyof typeof bottomBlurPresets;
    
    const preset = bottomBlurPresets[variantKey] || bottomBlurPresets.medium;
    
    // Allow overrides via props
    const height = pageProps?.bottomBlurHeight ?? preset.height;
    const blurAmount = pageProps?.bottomBlurAmount ?? preset.blur;
    const tint = pageProps?.bottomBlurTint ?? preset.tint;
    const brightness = pageProps?.bottomBlurBrightness ?? preset.brightness;
    const maskStrength = preset.maskStrength;

    return (
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${height}px`,
          background: `linear-gradient(to top, rgba(0,0,0,${tint}) 0%, rgba(0,0,0,${tint * 0.3}) 50%, transparent 100%)`,
          backdropFilter: `blur(${blurAmount}px) saturate(1.1) brightness(${brightness})`,
          WebkitBackdropFilter: `blur(${blurAmount}px) saturate(1.1) brightness(${brightness})`,
          maskImage: `linear-gradient(to top, rgba(0,0,0,${maskStrength}) 0%, rgba(0,0,0,${maskStrength * 0.5}) 50%, rgba(0,0,0,0) 100%)`,
          WebkitMaskImage: `linear-gradient(to top, rgba(0,0,0,${maskStrength}) 0%, rgba(0,0,0,${maskStrength * 0.5}) 50%, rgba(0,0,0,0) 100%)`,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    );
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
