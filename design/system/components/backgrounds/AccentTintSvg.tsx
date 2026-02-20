/**
 * Accent-tint för bakgrundsbilder.
 * - solid: bild som mask, fylls med en platt accentfärg (+ dark mode).
 * - luminance: bildens ljus/mörk-skala bevaras, accent som nyans (mörk = mörk accent, ljus = ljus accent).
 * ViewBox sätts dynamiskt efter container så cover ger samma ratio som CSS background-size: cover.
 */
import React, { useId, useRef, useState, useEffect } from 'react';

export interface AccentTintSvgProps {
  src: string;
  /** solid = platt färg; luminance = skala från bilden bevaras, accent som nyans */
  variant?: 'solid' | 'luminance';
  /** T.ex. 'cover' | 'contain' | 'auto' eller objectFit-värde */
  size?: string;
  /** T.ex. 'center' | 'top' eller objectPosition-värde */
  position?: string;
  /** Styrka: 0–1 = opacity; >1 = full opacity + maskkontrast (solid). Vid luminance = opacity. Default 1.2. */
  strength?: number;
  /** Valfri tintfärg (hex, rgb eller var()). Om ej satt används --foundation-accent-500. */
  tintColor?: string;
  /** Klass för wrapper (färg sätts via color för solid/luminance) */
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  /** Klass för dark-mode-rect (solid endast; opacity 0 i light, 1 i dark) */
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

const LUMINANCE_MATRIX =
  '0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0';

export const AccentTintSvg: React.FC<AccentTintSvgProps> = ({
  src,
  variant = 'solid',
  size = 'cover',
  position = 'center',
  strength = 1.2,
  tintColor,
  wrapperClassName,
  wrapperStyle,
  darkRectClassName,
  svgClassName,
}) => {
  const maskId = useId().replace(/:/g, '-');
  const maskBgId = useId().replace(/:/g, '-');
  const filterId = useId().replace(/:/g, '-');
  const luminanceFilterId = useId().replace(/:/g, '-');
  const aspect = maskPreserveAspectRatio(size, position);
  const opacity = strength <= 1 ? Math.min(1, Math.max(0, strength)) : 1;
  const maskContrast = strength > 1 ? Math.min(5, Math.max(1, strength)) : 1;
  const slope = maskContrast;
  const intercept = (1 - slope) * 0.5;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState({ w: 100, h: 100 });
  const [floodColor, setFloodColor] = useState('rgb(251, 146, 60)');

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

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const c = getComputedStyle(el).color;
    if (c) setFloodColor(c);
  }, [tintColor]);

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{
        color: tintColor ?? 'var(--foundation-accent-500)',
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
        {variant === 'luminance' ? (
          <>
            <defs>
              <filter id={luminanceFilterId} colorInterpolationFilters="sRGB">
                <feColorMatrix
                  in="SourceGraphic"
                  result="luminance"
                  type="matrix"
                  values={LUMINANCE_MATRIX}
                />
                <feFlood result="accent" floodColor={floodColor} />
                <feBlend in="luminance" in2="accent" result="tinted" mode="multiply" />
              </filter>
            </defs>
            <image
              href={src}
              width="100%"
              height="100%"
              preserveAspectRatio={aspect}
              filter={`url(#${luminanceFilterId})`}
              style={{ opacity }}
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </svg>
    </div>
  );
};
