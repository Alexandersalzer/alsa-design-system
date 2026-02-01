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
    subtle: { height: 60, maxBlur: 6 },
    medium: { height: 80, maxBlur: 10 },
    strong: { height: 100, maxBlur: 14 },
    reflection: { height: 120, maxBlur: 20 },
  };

  // Render bottom blur helper - uses stacked blur technique (8 layers like reference)
  // FIXED: Layers now cover full viewport with masks that only show blur at bottom
  const renderBottomBlurElement = () => {
    if (!showBottomBlur) return null;
    
    // Get variant or default to medium
    const variantKey = (typeof pageProps?.bottomBlur === 'string' 
      ? pageProps.bottomBlur 
      : 'medium') as keyof typeof bottomBlurPresets;
    
    const preset = bottomBlurPresets[variantKey] || bottomBlurPresets.medium;
    
    // Allow overrides via props
    const blurHeight = pageProps?.bottomBlurHeight ?? preset.height;
    const maxBlur = pageProps?.bottomBlurAmount ?? preset.maxBlur;
    
    // 8 layers with progressive blur (matching reference exactly)
    const blurValues = [
      maxBlur * 0.0078,
      maxBlur * 0.0156,
      maxBlur * 0.03125,
      maxBlur * 0.0625,
      maxBlur * 0.125,
      maxBlur * 0.25,
      maxBlur * 0.5,
      maxBlur * 1,
    ];
    
    // Mask gradients - using pixel values from bottom to ensure correct positioning
    // Each layer reveals blur in a band, stacking from subtle (top) to strong (bottom)
    const getMaskGradient = (layerIndex: number) => {
      // Calculate band positions based on layer index (0-7)
      // Layer 0 = topmost band (subtle blur), Layer 7 = bottommost (strongest blur)
      const bandHeight = blurHeight / 8;
      const bandTop = blurHeight - (bandHeight * (layerIndex + 2)); // Where this band starts (from bottom)
      const bandBottom = blurHeight - (bandHeight * layerIndex); // Where this band ends
      
      // Create gradient that fades in at top of band, solid in middle, fades out at bottom
      // Using calc() with 100vh to position from bottom of viewport
      return `linear-gradient(to bottom, 
        transparent 0%, 
        transparent calc(100% - ${Math.max(0, bandBottom + bandHeight)}px),
        black calc(100% - ${Math.max(0, bandBottom)}px),
        black calc(100% - ${Math.max(0, bandTop)}px),
        transparent calc(100% - ${Math.max(0, bandTop - bandHeight)}px),
        transparent 100%
      )`;
    };
    
    return (
      <>
        {blurValues.map((blur, i) => (
          <div
            key={`blur-${i}`}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'transparent',
              pointerEvents: 'none',
              zIndex: 9990 + i,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: getMaskGradient(i),
              WebkitMaskImage: getMaskGradient(i),
            }}
          />
        ))}
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

  // Render dynamic background based on type (Eden-style layered approach)
  const renderBackground = () => {
    const background = pageProps?.background;
    const layers: React.ReactNode[] = [];
    
    // Layer 1: Background image (supports both full images and grain/noise textures)
    if (pageProps?.backgroundImage) {
      // Build filter string from props
      const filterParts: string[] = [];
      if (pageProps.backgroundInvert) filterParts.push('invert(1)');
      if (pageProps.backgroundFilter) filterParts.push(pageProps.backgroundFilter);
      const filterValue = filterParts.length > 0 ? filterParts.join(' ') : undefined;

      // Detect if this is a "full" image (cover/contain) vs grain texture
      const bgSize = pageProps.backgroundSize;
      const isFullImage = bgSize === 'cover' || bgSize === 'contain';
      
      // Smart defaults based on image type
      const defaultSize = isFullImage ? bgSize : '64px';
      const defaultRepeat = isFullImage ? 'no-repeat' : 'repeat';
      const defaultOpacity = isFullImage ? 1 : 0.06;
      const defaultBlendMode = isFullImage ? 'normal' : 'overlay';

      layers.push(
        <div
          key="bg-image"
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `url(${pageProps.backgroundImage})`,
            backgroundSize: pageProps.backgroundSize || defaultSize,
            backgroundPosition: pageProps.backgroundPosition || 'center',
            backgroundRepeat: pageProps.backgroundRepeat ?? defaultRepeat,
            opacity: pageProps.backgroundOpacity ?? defaultOpacity,
            mixBlendMode: (pageProps.backgroundBlendMode as React.CSSProperties['mixBlendMode']) || defaultBlendMode,
            pointerEvents: 'none',
            zIndex: 1,
            ...(filterValue && { filter: filterValue }),
          }}
        />
      );
    }
    
    // Layer 2: Glow/spotlight effect (radial gradient at top with smooth steps to avoid banding)
    if (pageProps?.backgroundGlow) {
      const glowIntensity = pageProps.backgroundGlowIntensity ?? 0.06;
      const glowSize = pageProps.backgroundGlowSize || '80%';
      const glowPosition = pageProps.backgroundGlowPosition || 'top';
      
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
            background: `radial-gradient(ellipse 120% ${glowSize} at ${gradientPosition}, 
              rgba(255,255,255,${stops[0]}) 0%, 
              rgba(255,255,255,${stops[1]}) 15%, 
              rgba(255,255,255,${stops[2]}) 30%, 
              rgba(255,255,255,${stops[3]}) 45%, 
              rgba(255,255,255,${stops[4]}) 60%, 
              rgba(255,255,255,${stops[5]}) 75%, 
              rgba(255,255,255,${stops[6]}) 100%
            )`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      );
    }
    
    // Layer 3: Mask/fade effect (optional)
    if (pageProps?.backgroundMask) {
      layers.push(
        <div
          key="bg-mask"
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 0%, transparent 75%, rgba(0,0,0,0.3) 100%)',
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
          <div key="bg-component" style={{ position: 'fixed', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
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
      
      {/* Bottom blur bar */}
      {renderBottomBlurElement()}
    </div>
  );
}
