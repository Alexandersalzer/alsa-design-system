'use client';

import { PageProps } from '../../core/types/nodes';
import { renderBackgroundComponent } from '../../core/render/background';
import { BottomBlur } from '../../components/backgrounds/BottomBlur/BottomBlur';
import type { BottomBlurVariant } from '../../components/backgrounds/BottomBlur/BottomBlur';

interface PageBackgroundProps {
  pageProps?: PageProps;
  children: React.ReactNode;
}

/**
 * PageBackground - Renders optional page-level background with content
 * Used to add subtle textures, patterns, colors or images behind page content
 * 
 * Features:
 * - background: 'generative' | 'gradient' | 'pattern' | 'video' | 'image' | 'particle'
 * - backgroundColor: Solid color background
 * - backgroundImage: Image/pattern with configurable opacity
 * - backgroundOverlay: Color tint on top of image
 * - transparentSections: Makes child sections transparent (default: true)
 * - bottomBlur: Adds a fixed blur/gradient bar at the bottom of the screen
 */
export function PageBackground({ pageProps, children }: PageBackgroundProps) {
  const hasBackground = !!pageProps?.background || !!pageProps?.backgroundImage || !!pageProps?.backgroundColor;
  const showBottomBlur = !!pageProps?.bottomBlur;

  // Resolve bottomBlur variant from props
  const getBottomBlurVariant = (): BottomBlurVariant => {
    if (typeof pageProps?.bottomBlur === 'string') {
      return pageProps.bottomBlur as BottomBlurVariant;
    }
    return 'medium';
  };

  // If no background but bottomBlur is enabled, still render it
  if (!hasBackground) {
    return (
      <>
        {children}
        <BottomBlur
          enabled={showBottomBlur}
          variant={getBottomBlurVariant()}
          height={pageProps?.bottomBlurHeight}
          blurAmount={pageProps?.bottomBlurAmount}
          position={pageProps?.bottomBlurPosition}
          opacity={pageProps?.bottomBlurOpacity}
        />
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
    const layers: React.ReactNode[] = [];
    
    // Layer 1: Background image
    // Defaults are for normal images (cover, full opacity)
    // For grain textures, explicitly set: backgroundSize="64px", backgroundRepeat="repeat", backgroundOpacity=0.06, backgroundBlendMode="overlay"
    if (pageProps?.backgroundImage) {
      // Build filter string from props
      const filterParts: string[] = [];
      if (pageProps.backgroundInvert) filterParts.push('invert(1)');
      if (pageProps.backgroundFilter) filterParts.push(pageProps.backgroundFilter);
      const filterValue = filterParts.length > 0 ? filterParts.join(' ') : undefined;

      layers.push(
        <div
          key="bg-image"
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `url(${pageProps.backgroundImage})`,
            backgroundSize: pageProps.backgroundSize || 'cover',
            backgroundPosition: pageProps.backgroundPosition || 'center',
            backgroundRepeat: pageProps.backgroundRepeat || 'no-repeat',
            opacity: pageProps.backgroundOpacity ?? 1,
            mixBlendMode: (pageProps.backgroundBlendMode as React.CSSProperties['mixBlendMode']) || 'normal',
            pointerEvents: 'none',
            zIndex: 1,
            ...(filterValue && { filter: filterValue }),
          }}
        />
      );
    }
    
    // Layer 2: Glow/spotlight effect (radial gradient with smooth steps to avoid banding)
    if (pageProps?.backgroundGlow) {
      const glowIntensity = pageProps.backgroundGlowIntensity ?? 0.15;
      const glowSize = pageProps.backgroundGlowSize || '60%';
      const glowWidth = pageProps.backgroundGlowWidth || '120%';
      const glowPosition = pageProps.backgroundGlowPosition || 'top';
      const glowColor = pageProps.backgroundGlowColor || '255,255,255'; // RGB format
      
      // Calculate gradient stops based on intensity (smooth 7-step fade)
      const stops = [
        glowIntensity,
        glowIntensity * 0.67,
        glowIntensity * 0.42,
        glowIntensity * 0.25,
        glowIntensity * 0.13,
        glowIntensity * 0.05,
        0
      ];
      
      // Position mapping
      const positionMap: Record<string, string> = {
        'top': '50% 0%',
        'center': '50% 50%',
        'bottom': '50% 100%',
      };
      const gradientPosition = positionMap[glowPosition] || glowPosition;
      
      layers.push(
        <div
          key="bg-glow"
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: `radial-gradient(ellipse ${glowWidth} ${glowSize} at ${gradientPosition}, 
              rgba(${glowColor},${stops[0]}) 0%, 
              rgba(${glowColor},${stops[1]}) 15%, 
              rgba(${glowColor},${stops[2]}) 30%, 
              rgba(${glowColor},${stops[3]}) 45%, 
              rgba(${glowColor},${stops[4]}) 60%, 
              rgba(${glowColor},${stops[5]}) 75%, 
              rgba(${glowColor},${stops[6]}) 100%
            )`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      );
    }
    
    // Layer 3: Mask/fade effect (optional vignette/darkening at edges)
    if (pageProps?.backgroundMask) {
      const maskOpacity = pageProps.backgroundMaskOpacity ?? 0.3;
      const maskStart = pageProps.backgroundMaskStart ?? 75; // Where fade begins (%)
      const maskColor = pageProps.backgroundMaskColor || '0,0,0'; // RGB format
      
      layers.push(
        <div
          key="bg-mask"
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: `linear-gradient(to bottom, transparent 0%, transparent ${maskStart}%, rgba(${maskColor},${maskOpacity}) 100%)`,
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
      );
    }
    
    // Layer 4: Dynamic background component (particle, generative, etc)
    if (background && background !== 'image' && pageProps) {
      const bgComponent = renderBackgroundComponent(background, pageProps);
      if (bgComponent) {
        layers.push(
          <div key="bg-component" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            {bgComponent}
          </div>
        );
      }
    }
    
    return layers.length > 0 ? <>{layers}</> : null;
  };

  return (
    <div style={wrapperStyle}>
      {renderBackground()}
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
      
      {/* Bottom blur effect */}
      <BottomBlur
        enabled={showBottomBlur}
        variant={getBottomBlurVariant()}
        height={pageProps?.bottomBlurHeight}
        blurAmount={pageProps?.bottomBlurAmount}
        position={pageProps?.bottomBlurPosition}
        opacity={pageProps?.bottomBlurOpacity}
      />
    </div>
  );
}
