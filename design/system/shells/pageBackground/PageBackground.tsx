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
      height: 50,
      blur: 3,
      fade: 0.3,
    },
    medium: {
      height: 70,
      blur: 5,
      fade: 0.5,
    },
    strong: {
      height: 90,
      blur: 8,
      fade: 0.7,
    },
    reflection: {
      height: 120,
      blur: 12,
      fade: 0.85,
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
    const fade = preset.fade;

    return (
      <>
        {/* Gradient fade layer - creates the "haze" effect */}
        <div
          aria-hidden="true"
          className="bottom-blur-fade"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${height}px`,
            background: `linear-gradient(to top, 
              color-mix(in srgb, var(--surface-base) ${fade * 100}%, transparent) 0%, 
              color-mix(in srgb, var(--surface-base) ${fade * 40}%, transparent) 40%,
              transparent 100%
            )`,
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        />
        {/* Subtle blur layer */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${height * 0.6}px`,
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
            maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
      </>
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
