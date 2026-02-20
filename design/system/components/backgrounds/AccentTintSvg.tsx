/**
 * Accent-tint för bakgrundsbilder.
 * - solid: bild som mask, fylls med en platt accentfärg (+ dark mode).
 * - luminance: bildens ljus/mörk-skala bevaras. Använder accent-skalan (mörk/mitten/ljus) för kontrast och detalj.
 *   Vita/ljusa pixlar (L ≥ tröskel) tintas inte – sektionens bakgrund (--surface-page) syns; följer --is-dark.
 * ViewBox sätts dynamiskt efter container så cover ger samma ratio som CSS background-size: cover.
 */
import React, { useId, useRef, useState, useEffect } from 'react';

export interface AccentTintSvgProps {
  src: string;
  /** solid = platt färg; luminance = accent-skala (3 steg) för kontrast och detaljer */
  variant?: 'solid' | 'luminance';
  /** Använd 3 steg från accent-skalan (700/500/300) för mer kontrast. Om false eller tintColor satt = en färg. Default true i luminance. */
  accentScale?: boolean;
  /** T.ex. 'cover' | 'contain' | 'auto' eller objectFit-värde */
  size?: string;
  /** T.ex. 'center' | 'top' eller objectPosition-värde */
  position?: string;
  /** Styrka: 0–1 = opacity; >1 = full opacity + maskkontrast (solid). Vid luminance = opacity. Default 1.2. */
  strength?: number;
  /** Valfri tintfärg (hex, rgb eller var()). Om satt används en färg; annars accent-skala (theme-aware). */
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
  accentScale = true,
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
  const darkSwatchRef = useRef<HTMLSpanElement>(null);
  const midSwatchRef = useRef<HTMLSpanElement>(null);
  const lightSwatchRef = useRef<HTMLSpanElement>(null);

  const [viewBox, setViewBox] = useState({ w: 100, h: 100 });
  const [floodColor, setFloodColor] = useState('rgb(251, 146, 60)');
  const [scaleColors, setScaleColors] = useState<{ dark: string; mid: string; light: string }>({
    dark: 'rgb(194, 65, 12)',
    mid: 'rgb(251, 146, 60)',
    light: 'rgb(253, 186, 116)',
  });

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

  useEffect(() => {
    if (tintColor || !accentScale) return;
    const d = darkSwatchRef.current;
    const m = midSwatchRef.current;
    const l = lightSwatchRef.current;
    if (!d || !m || !l) return;
    const dark = getComputedStyle(d).color;
    const mid = getComputedStyle(m).color;
    const light = getComputedStyle(l).color;
    if (dark && mid && light) setScaleColors({ dark, mid, light });
  }, [tintColor, accentScale]);

  const useScale = variant === 'luminance' && accentScale && !tintColor;

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{
        color: tintColor ?? 'var(--accent-500)',
        width: '100%',
        height: '100%',
        ...wrapperStyle,
      }}
      aria-hidden="true"
    >
      {useScale && (
        <span
          ref={darkSwatchRef}
          style={{ position: 'absolute', left: -9999, color: 'var(--accent-700)' }}
          aria-hidden
        />
      )}
      {useScale && (
        <span
          ref={midSwatchRef}
          style={{ position: 'absolute', left: -9999, color: 'var(--accent-500)' }}
          aria-hidden
        />
      )}
      {useScale && (
        <span
          ref={lightSwatchRef}
          style={{ position: 'absolute', left: -9999, color: 'var(--accent-300)' }}
          aria-hidden
        />
      )}
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
                {/* L ≥ 0.6 → transparens (sektionens bakgrund syns) */}
                <feComponentTransfer in="luminance" result="darkOnly">
                  <feFuncR type="discrete" tableValues="0 0.1 0.2 0.3 0.4 0.5 0 0 0 0 0" />
                  <feFuncG type="discrete" tableValues="0 0.1 0.2 0.3 0.4 0.5 0 0 0 0 0" />
                  <feFuncB type="discrete" tableValues="0 0.1 0.2 0.3 0.4 0.5 0 0 0 0 0" />
                  <feFuncA type="discrete" tableValues="0 0.1 0.2 0.3 0.4 0.5 0 0 0 0 0" />
                </feComponentTransfer>
                {useScale ? (
                  <>
                    {/* 3 steg: mörk (L 0–0.2) = accent-700, mitten (0.3–0.4) = accent-500, ljus (0.5) = accent-300; L≥0.6 = transparens */}
                    <feComponentTransfer in="luminance" result="maskDark">
                      <feFuncR type="discrete" tableValues="1 1 1 0 0 0 0 0 0 0 0" />
                      <feFuncG type="discrete" tableValues="1 1 1 0 0 0 0 0 0 0 0" />
                      <feFuncB type="discrete" tableValues="1 1 1 0 0 0 0 0 0 0 0" />
                      <feFuncA type="discrete" tableValues="1 1 1 0 0 0 0 0 0 0 0" />
                    </feComponentTransfer>
                    <feComponentTransfer in="luminance" result="maskMid">
                      <feFuncR type="discrete" tableValues="0 0 0 1 1 0 0 0 0 0 0" />
                      <feFuncG type="discrete" tableValues="0 0 0 1 1 0 0 0 0 0 0" />
                      <feFuncB type="discrete" tableValues="0 0 0 1 1 0 0 0 0 0 0" />
                      <feFuncA type="discrete" tableValues="0 0 0 1 1 0 0 0 0 0 0" />
                    </feComponentTransfer>
                    <feComponentTransfer in="luminance" result="maskLight">
                      <feFuncR type="discrete" tableValues="0 0 0 0 0 1 0 0 0 0 0" />
                      <feFuncG type="discrete" tableValues="0 0 0 0 0 1 0 0 0 0 0" />
                      <feFuncB type="discrete" tableValues="0 0 0 0 0 1 0 0 0 0 0" />
                      <feFuncA type="discrete" tableValues="0 0 0 0 0 1 0 0 0 0 0" />
                    </feComponentTransfer>
                    <feFlood result="accentDark" floodColor={scaleColors.dark} />
                    <feFlood result="accentMid" floodColor={scaleColors.mid} />
                    <feFlood result="accentLight" floodColor={scaleColors.light} />
                    <feComposite in="accentDark" in2="maskDark" result="layerDark" operator="in" />
                    <feComposite in="accentMid" in2="maskMid" result="layerMid" operator="in" />
                    <feComposite in="accentLight" in2="maskLight" result="layerLight" operator="in" />
                    <feBlend in="layerDark" in2="layerMid" result="tintedMid" mode="normal" />
                    <feBlend in="tintedMid" in2="layerLight" result="tinted" mode="normal" />
                  </>
                ) : (
                  <>
                    <feFlood result="accent" floodColor={floodColor} />
                    <feBlend in="darkOnly" in2="accent" result="tinted" mode="multiply" />
                  </>
                )}
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
