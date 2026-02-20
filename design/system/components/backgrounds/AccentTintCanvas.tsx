/**
 * Accent-tint med pixelavläsning och 9-stegs färgskala (accent-100 … accent-900).
 * Läser bildens pixlar, beräknar luminans och mappar till design tokens.
 * L ≥ 0.6 = transparens. Kräver CORS på bild-URL; vid CORS-fel använd fallback (t.ex. SVG).
 */
import React, { useRef, useState, useEffect } from 'react';

const ACCENT_STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const LUMINANCE_WHITE_THRESHOLD = 0.6; // L >= detta → transparens
const MAX_CANVAS_SIZE = 1400; // begränsa för prestanda

function parseRgb(cssColor: string): [number, number, number] | null {
  const m = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
  const hex = cssColor.replace(/^#/, '');
  if (hex.length === 6) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  return null;
}

function luminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

export interface AccentTintCanvasProps {
  src: string;
  size?: string;
  position?: string;
  strength?: number;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  /** Vid CORS-fel rendras denna (t.ex. SVG-fallback) istället för tom yta */
  fallback?: React.ReactNode;
}

export const AccentTintCanvas: React.FC<AccentTintCanvasProps> = ({
  src,
  size = 'cover',
  position = 'center',
  strength = 1.2,
  wrapperClassName,
  wrapperStyle,
  fallback = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [accentRgb, setAccentRgb] = useState<[number, number, number][]>([]);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [corsOk, setCorsOk] = useState<boolean | null>(null);
  const opacity = strength <= 1 ? Math.min(1, Math.max(0, strength)) : 1;

  // Läs 9 accent-färger från tokens (refs till dolda element)
  const swatchRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rgb: [number, number, number][] = [];
    for (let i = 0; i < 9; i++) {
      const swatch = swatchRefs.current[i];
      if (!swatch) continue;
      const c = getComputedStyle(swatch).color;
      const p = parseRgb(c);
      if (p) rgb.push(p);
    }
    if (rgb.length === 9) setAccentRgb(rgb);
  }, []);

  useEffect(() => {
    if (accentRgb.length !== 9 || !src) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > MAX_CANVAS_SIZE || h > MAX_CANVAS_SIZE) {
        const scale = MAX_CANVAS_SIZE / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setCorsOk(false);
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);
      let data: ImageData;
      try {
        data = ctx.getImageData(0, 0, w, h);
      } catch {
        setCorsOk(false);
        return;
      }
      setCorsOk(true);

      const { data: d } = data;
      const numPixels = w * h;

      for (let i = 0; i < numPixels; i++) {
        const r = d[i * 4];
        const g = d[i * 4 + 1];
        const b = d[i * 4 + 2];
        const a = d[i * 4 + 3];

        const L = luminance(r, g, b);

        if (L >= LUMINANCE_WHITE_THRESHOLD) {
          d[i * 4] = 0;
          d[i * 4 + 1] = 0;
          d[i * 4 + 2] = 0;
          d[i * 4 + 3] = 0;
          continue;
        }

        // Mappa L [0, 0.6) → index 8 (mörkast) … 0 (ljusast)
        const t = L / LUMINANCE_WHITE_THRESHOLD;
        const index = Math.min(8, Math.floor((1 - t) * 9));
        const [R, G, B] = accentRgb[index];

        d[i * 4] = R;
        d[i * 4 + 1] = G;
        d[i * 4 + 2] = B;
        d[i * 4 + 3] = a;
      }

      ctx.putImageData(data, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };

    img.onerror = () => setCorsOk(false);
    img.src = src;
  }, [src, accentRgb]);

  const swatches = (
    <>
      {ACCENT_STEPS.map((step, i) => (
        <span
          key={step}
          ref={(el) => { swatchRefs.current[i] = el; }}
          style={{ position: 'absolute', left: -9999, color: `var(--accent-${step})` }}
          aria-hidden
        />
      ))}
    </>
  );

  return (
    <div
      ref={containerRef}
      className={wrapperClassName}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        ...wrapperStyle,
      }}
      aria-hidden="true"
    >
      {swatches}
      {/* Medan färger laddas eller bild processas */}
      {accentRgb.length !== 9 && (
        <div style={{ width: '100%', height: '100%', background: 'var(--surface-page)' }} />
      )}
      {accentRgb.length === 9 && !dataUrl && corsOk !== false && (
        <div style={{ width: '100%', height: '100%', background: 'var(--surface-page)' }} />
      )}
      {corsOk === false && (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {fallback ?? (
            <div style={{ width: '100%', height: '100%', background: 'var(--surface-page)' }} />
          )}
        </div>
      )}
      {dataUrl && (
        <img
          src={dataUrl}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: size === 'contain' ? 'contain' : 'cover',
            objectPosition: position || 'center',
            opacity,
          }}
        />
      )}
    </div>
  );
};
