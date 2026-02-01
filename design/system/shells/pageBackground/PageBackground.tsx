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
    
    // 8 layers with progressive blur (matching reference exactly)
    // Blur values: 0.078, 0.156, 0.3125, 0.625, 1.25, 2.5, 5, 10 (scaled to maxBlur)
    const blurValues = [
      maxBlur * 0.0078,  // ~0.078px at maxBlur=10
      maxBlur * 0.0156,  // ~0.156px
      maxBlur * 0.03125, // ~0.3125px
      maxBlur * 0.0625,  // ~0.625px
      maxBlur * 0.125,   // ~1.25px
      maxBlur * 0.25,    // ~2.5px
      maxBlur * 0.5,     // ~5px
      maxBlur * 1,       // ~10px
    ];
    
    // Mask gradients matching reference (top to bottom, 12.5% bands)
    const maskGradients = [
      'linear-gradient(rgba(0,0,0,0) 0%, rgb(0,0,0) 12.5%, rgb(0,0,0) 25%, rgba(0,0,0,0) 37.5%)',
      'linear-gradient(rgba(0,0,0,0) 12.5%, rgb(0,0,0) 25%, rgb(0,0,0) 37.5%, rgba(0,0,0,0) 50%)',
      'linear-gradient(rgba(0,0,0,0) 25%, rgb(0,0,0) 37.5%, rgb(0,0,0) 50%, rgba(0,0,0,0) 62.5%)',
      'linear-gradient(rgba(0,0,0,0) 37.5%, rgb(0,0,0) 50%, rgb(0,0,0) 62.5%, rgba(0,0,0,0) 75%)',
      'linear-gradient(rgba(0,0,0,0) 50%, rgb(0,0,0) 62.5%, rgb(0,0,0) 75%, rgba(0,0,0,0) 87.5%)',
      'linear-gradient(rgba(0,0,0,0) 62.5%, rgb(0,0,0) 75%, rgb(0,0,0) 87.5%, rgba(0,0,0,0) 100%)',
      'linear-gradient(rgba(0,0,0,0) 75%, rgb(0,0,0) 87.5%, rgb(0,0,0) 100%)',
      'linear-gradient(rgba(0,0,0,0) 87.5%, rgb(0,0,0) 100%)',
    ];
    
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${height}px`,
          pointerEvents: 'none',
          zIndex: 9990,
          overflow: 'hidden',
        }}
      >
        {blurValues.map((blur, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: i + 1,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: maskGradients[i],
              WebkitMaskImage: maskGradients[i],
            }}
          />
        ))}
      </div>
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
    
    // Layer 1: Noise/grain texture with blend mode
    if (pageProps?.backgroundImage) {
      layers.push(
        <div
          key="bg-noise"
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `url(${pageProps.backgroundImage})`,
            backgroundSize: pageProps.backgroundSize || '64px',
            backgroundPosition: pageProps.backgroundPosition || 'center',
            backgroundRepeat: pageProps.backgroundRepeat || 'repeat',
            opacity: pageProps.backgroundOpacity ?? 0.06,
            mixBlendMode: (pageProps.backgroundBlendMode as React.CSSProperties['mixBlendMode']) || 'overlay',
            pointerEvents: 'none',
            zIndex: 1,
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
