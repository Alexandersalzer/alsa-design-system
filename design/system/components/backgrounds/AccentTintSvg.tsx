/**
 * Delad accent-mask: bild som mask, fylls med accentfärg + dark mode (vita delar → surface-page).
 * Används av ImageBackground och Image när tint="accent".
 * ViewBox sätts dynamiskt efter container så cover ger samma ratio som CSS background-size: cover.
 */
import React, { useId, useRef, useState, useEffect } from 'react';

export interface AccentTintSvgProps {
  src: string;
  /** T.ex. 'cover' | 'contain' | 'auto' eller objectFit-värde */
  size?: string;
  /** T.ex. 'center' | 'top' eller objectPosition-värde */
  position?: string;
  /** Styrka: 0–1 = opacity; >1 = full opacity + maskkontrast (1.5–2 tydlig, 3+ mer posterat/hårt, max 5). Default 1.2. */
  strength?: number;
  /** Klass för wrapper (färg sätts via color: var(--foundation-accent-500)) */
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  /** Klass för dark-mode-rect (opacity 0 i light, 1 i dark – sätts av konsumentens CSS) */
  darkRectClassName?: string;
  /** Klass för själva SVG-elementet */
  svgClassName?: string;
}

function maskPreserveAspectRatio(size: string, position: string): string {
  const s = (size || 'cover').toLowerCase();
  if (s === 'cover' || s === 'fill') return 'xMidYMid slice';
  if (s === 'contain') return 'xMidYMid meet';
  if (s === 'none' || s === 'scale-down') return 'xMidYMid meet';
  const pos = (position || 'center').toLowerCase();
  const x = pos.includes('left') ? 'Min' : pos.includes('right') ? 'Max' : 'Mid';
  const y = pos.includes('top') ? 'Min' : pos.includes('bottom') ? 'Max' : 'Mid';
  return `${x}${y} meet`;
}

export const AccentTintSvg: React.FC<AccentTintSvgProps> = ({
  src,
  size = 'cover',
  position = 'center',
  strength = 1.2,
  wrapperClassName,
  wrapperStyle,
  darkRectClassName,
  svgClassName,
}) => {
  const maskId = useId().replace(/:/g, '-');
  const maskBgId = useId().replace(/:/g, '-');
  const filterId = useId().replace(/:/g, '-');
  const aspect = maskPreserveAspectRatio(size, position);
  // 0–1: styr opacity på accent; >1: full opacity + maskkontrast (höga värden = mer posterat/hårt)
  const opacity = strength <= 1 ? Math.min(1, Math.max(0, strength)) : 1;
  const maskContrast = strength > 1 ? Math.min(5, Math.max(1, strength)) : 1;
  const slope = maskContrast;
  const intercept = (1 - slope) * 0.5;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState({ w: 100, h: 100 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect ?? { width: 100, height: 100 };
      if (width > 0 && height > 0) {
        setViewBox({ w: 100, h: (100 * height) / width });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{
        color: 'var(--foundation-accent-500)',
        width: '100%',
        height: '100%',
        ...wrapperStyle,
      }}
      aria-hidden="true"
    >
      <svg
        className={svgClassName}
        preserveAspectRatio="none"
        viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"
            />
            {maskContrast > 1 && (
              <feComponentTransfer>
                <feFuncR type="linear" slope={slope} intercept={intercept} />
                <feFuncG type="linear" slope={slope} intercept={intercept} />
                <feFuncB type="linear" slope={slope} intercept={intercept} />
                <feFuncA type="linear" slope={slope} intercept={intercept} />
              </feComponentTransfer>
            )}
          </filter>
          <mask id={maskId}>
            <image
              href={src}
              width="100%"
              height="100%"
              preserveAspectRatio={aspect}
              filter={`url(#${filterId})`}
            />
          </mask>
          <mask id={maskBgId}>
            <image
              href={src}
              width="100%"
              height="100%"
              preserveAspectRatio={aspect}
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="var(--surface-page)"
          mask={`url(#${maskBgId})`}
          className={darkRectClassName}
        />
        <rect
          width="100%"
          height="100%"
          fill="currentColor"
          mask={`url(#${maskId})`}
          opacity={opacity}
        />
      </svg>
    </div>
  );
};
