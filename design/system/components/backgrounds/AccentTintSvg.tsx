/**
 * Delad accent-mask: bild som mask, fylls med accentfärg + dark mode (vita delar → surface-page).
 * Används av ImageBackground och Image när tint="accent".
 */
import React, { useId } from 'react';

export interface AccentTintSvgProps {
  src: string;
  /** T.ex. 'cover' | 'contain' | 'auto' eller objectFit-värde */
  size?: string;
  /** T.ex. 'center' | 'top' eller objectPosition-värde */
  position?: string;
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
  wrapperClassName,
  wrapperStyle,
  darkRectClassName,
  svgClassName,
}) => {
  const maskId = useId().replace(/:/g, '-');
  const maskBgId = useId().replace(/:/g, '-');
  const filterId = useId().replace(/:/g, '-');
  const aspect = maskPreserveAspectRatio(size, position);

  return (
    <div
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
        viewBox="0 0 100 100"
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
        <rect width="100%" height="100%" fill="currentColor" mask={`url(#${maskId})`} />
      </svg>
    </div>
  );
};
