"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../../utils/cn';
import {
  hexToOklch,
  oklchToHex,
  paramToOklch,
  oklchToParam,
  maxChromaInGamut,
} from '../../../core/design/colorEngine';
import './ColorPicker.css';

// =============================================================================
// TYPES
// =============================================================================

export interface PalettePreset {
  name: string;
  hex: string;
}

export interface ColorPickerPanelProps {
  /** Current color (hex). */
  value: string;
  /** Called with the new hex string on every change. */
  onChange: (hex: string) => void;
  /** Optional curated quick-pick swatches. Rendered above the controls. */
  palette?: PalettePreset[];
  /** When true, hue is locked (used by base color where the user supplies a
   *  hue once but only adjusts lightness/saturation). Currently unused but
   *  reserved for future surface-tinted bases. */
  lockHue?: boolean;
  className?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// =============================================================================
// COMPONENT — single shade slider + hue strip
// =============================================================================

export const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({
  value,
  onChange,
  palette,
  className,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    if (!popoverOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [popoverOpen]);

  const oklch = (() => {
    try { return hexToOklch(value); } catch { return { l: 0.6, c: 0.15, h: 240 }; }
  })();

  // The single "shade" slider parameter — derived from current OKLCH
  const shadeT = oklchToParam(oklch);

  /** Commit a hue change — keep the same shade ramp position. */
  const setHue = (newHue: number) => {
    const next = paramToOklch(shadeT, ((newHue % 360) + 360) % 360);
    onChange(oklchToHex(next));
  };

  /** Commit a shade change — keep the same hue. */
  const setShade = (newT: number) => {
    const next = paramToOklch(clamp(newT, 0, 1), oklch.h);
    onChange(oklchToHex(next));
  };

  return (
    <div ref={wrapRef} className={cn('alsa-cpicker', className)}>
      {/* Curated palette */}
      {palette && palette.length > 0 && (
        <div className="alsa-cpicker__palette">
          {palette.map((p) => (
            <button
              key={p.hex + p.name}
              type="button"
              title={p.name}
              aria-label={p.name}
              className={cn(
                'alsa-cpicker__chip',
                value.toUpperCase() === p.hex.toUpperCase() && 'alsa-cpicker__chip--selected'
              )}
              style={{ backgroundColor: p.hex }}
              onClick={() => onChange(p.hex.toUpperCase())}
            />
          ))}
        </div>
      )}

      {/* Hue strip */}
      <div className="alsa-cpicker__row">
        <button
          type="button"
          className="alsa-cpicker__trigger"
          style={{ backgroundColor: HEX_REGEX.test(value) ? value : '#ccc' }}
          onClick={() => setPopoverOpen((s) => !s)}
          aria-label="Open advanced color picker"
          aria-expanded={popoverOpen}
        />
        <div
          className="alsa-cpicker__hue-track"
          style={{ background: hueStripCss() }}
        >
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={Math.round(oklch.h)}
            onChange={(e) => setHue(parseFloat(e.target.value))}
            className="alsa-cpicker__hue-input"
            aria-label="Hue"
            style={{
              ['--thumb-color' as string]: HEX_REGEX.test(value) ? value : '#fff',
            }}
          />
        </div>
      </div>

      {/* Shade strip — the single perceptual slider */}
      <div
        className="alsa-cpicker__hue-track"
        style={{ background: shadeStripCss(oklch.h) }}
      >
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={shadeT}
          onChange={(e) => setShade(parseFloat(e.target.value))}
          className="alsa-cpicker__hue-input"
          aria-label="Shade"
          style={{
            ['--thumb-color' as string]: HEX_REGEX.test(value) ? value : '#fff',
          }}
        />
      </div>

      {/* Advanced popover — just hex input now */}
      {popoverOpen && (
        <div className="alsa-cpicker__popover" role="dialog">
          <HexInput value={value} onChange={onChange} />
          <Body>
            Advanced: paste any hex. The picker will snap to the nearest point on its smooth ramp.
          </Body>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SUB: HEX INPUT
// =============================================================================

const HexInput: React.FC<{ value: string; onChange: (hex: string) => void }> = ({ value, onChange }) => {
  const [draft, setDraft] = useState(value);
  useEffect(() => { setDraft(value); }, [value]);

  const commit = () => {
    if (HEX_REGEX.test(draft)) onChange(draft.toUpperCase());
    else setDraft(value);
  };

  return (
    <div className="alsa-cpicker__hex">
      <span className="alsa-cpicker__hex-prefix">HEX</span>
      <input
        type="text"
        value={draft.replace(/^#/, '')}
        onChange={(e) => setDraft('#' + e.target.value.toUpperCase().slice(0, 6))}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
        className="alsa-cpicker__hex-input"
        spellCheck={false}
        maxLength={6}
        aria-label="Hex color"
      />
    </div>
  );
};

// Light wrapper around inline help text — we don't import Body to keep the
// component standalone (would create circular deps).
const Body: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{children}</span>
);

// =============================================================================
// GRADIENT HELPERS
// =============================================================================

/** Static rainbow strip — same hues at L=0.65, gamut-aware peak chroma per hue. */
function hueStripCss(): string {
  const stops: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const h = (i * 30) % 360;
    const c = Math.min(0.18, maxChromaInGamut(0.65, h));
    stops.push(`${oklchToHex({ l: 0.65, c, h })} ${(i / 12) * 100}%`);
  }
  return `linear-gradient(to right, ${stops.join(', ')})`;
}

/** Per-hue shade strip — samples the perceptual ramp from t=0 to t=1. */
function shadeStripCss(hue: number): string {
  const stops: string[] = [];
  const N = 10;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    stops.push(`${oklchToHex(paramToOklch(t, hue))} ${(t * 100).toFixed(0)}%`);
  }
  return `linear-gradient(to right, ${stops.join(', ')})`;
}
