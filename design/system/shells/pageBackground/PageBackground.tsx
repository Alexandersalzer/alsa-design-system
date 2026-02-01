'use client';

import { PageProps } from '../../core/types/nodes';
import { renderBackgroundComponent } from '../../core/render/background';
import { EdgeBlur } from '../../components/backgrounds/EdgeBlur';

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
 * - edgeBlur: Adds a fixed blur effect at the edge of the screen
 */
export function PageBackground({ pageProps, children }: PageBackgroundProps) {
  const hasBackground = !!pageProps?.background || !!pageProps?.backgroundImage || !!pageProps?.backgroundColor;
  const showEdgeBlur = pageProps?.edgeBlur === true;

  // Render edge blur component
  const renderEdgeBlur = () => {
    if (!showEdgeBlur) return null;
    
    return (
      <EdgeBlur
        position={pageProps?.edgeBlurPosition || 'bottom'}
        mode={pageProps?.edgeBlurMode || 'fade'}
        height={pageProps?.edgeBlurHeight}
        blur={pageProps?.edgeBlurAmount}
        opacity={pageProps?.edgeBlurOpacity}
      />
    );
  };

  // If no background but edgeBlur is enabled, still render it
  if (!hasBackground) {
    return (
      <>
        {children}
        {renderEdgeBlur()}
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
      
      {/* Edge blur effect */}
      {renderEdgeBlur()}
    </div>
  );
}
