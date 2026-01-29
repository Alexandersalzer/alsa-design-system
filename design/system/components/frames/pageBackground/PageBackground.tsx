'use client';

import { PageProps } from '../../../core/types/nodes';
import { GenerativeBackground } from '../../backgrounds/GenerativeBackground/GenerativeBackground';
import { GradientBackground } from '../../backgrounds/GradientBackground/GradientBackground';
import { PatternBackground } from '../../backgrounds/PatternBackground/PatternBackground';
import { VideoBackground } from '../../backgrounds/VideoBackground/VideoBackground';
import { SolidBackground } from '../../backgrounds/SolidBackground/SolidBackground';

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
 */
export function PageBackground({ pageProps, children }: PageBackgroundProps) {
  const hasBackground = !!pageProps?.background || !!pageProps?.backgroundImage || !!pageProps?.backgroundColor;

  if (!hasBackground) {
    return <>{children}</>;
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
    
    switch (background) {
      case 'generative':
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <GenerativeBackground
              variant={pageProps.generativeVariant || 'subtle'}
              colorScheme={pageProps.generativeColorScheme || 'accent'}
              seed={pageProps.generativeSeed}
              intensity={pageProps.generativeIntensity}
              blurAmount={pageProps.generativeBlurAmount}
              fadeEdge={pageProps.generativeFadeEdge}
              fadeStrength={pageProps.generativeFadeStrength}
            />
          </div>
        );
        
      case 'gradient':
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <GradientBackground
              type={pageProps.gradientType || 'mesh'}
              colorScheme={pageProps.gradientColorScheme || 'accent'}
              animated={pageProps.gradientAnimated}
              intensity={pageProps.gradientIntensity}
              fadeEdge={pageProps.gradientFadeEdge}
              fadeStrength={pageProps.gradientFadeStrength}
            />
          </div>
        );
        
      case 'pattern':
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <PatternBackground
              type={pageProps.patternType || 'dots'}
              colorScheme={pageProps.patternColorScheme || 'neutral'}
              density={pageProps.patternDensity}
              animated={pageProps.patternAnimated}
              opacity={pageProps.patternOpacity}
              fadeEdge={pageProps.patternFadeEdge}
              fadeStrength={pageProps.patternFadeStrength}
            />
          </div>
        );
        
      case 'video':
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <VideoBackground
              src={pageProps.videoSrc || ''}
              poster={pageProps.videoPoster}
              fit={pageProps.videoFit}
              overlayType={pageProps.videoOverlayType}
              overlayOpacity={pageProps.videoOverlayOpacity}
              playbackRate={pageProps.videoPlaybackRate}
              fadeEdge={pageProps.videoFadeEdge}
              fadeStrength={pageProps.videoFadeStrength}
            />
          </div>
        );
      
      case 'solid':
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <SolidBackground
              color={pageProps.solidColor}
              colorPreset={pageProps.solidColorPreset}
              opacity={pageProps.solidOpacity}
              fadeEdge={pageProps.solidFadeEdge}
              fadeStrength={pageProps.solidFadeStrength}
            />
          </div>
        );
        
      case 'image':
      default:
        // Legacy image background support
        if (pageProps?.backgroundImage) {
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
              {pageProps.backgroundOverlay && (
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
    }
  };

  return (
    <div style={wrapperStyle}>
      {renderBackground()}
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
