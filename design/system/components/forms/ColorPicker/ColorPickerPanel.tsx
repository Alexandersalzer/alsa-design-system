"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/cn';
import {
  hexToOklch,
  oklchToHex,
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
  /** Optional curated quick-pick swatches at the top of the popover. */
  palette?: PalettePreset[];
  /** Reserved (kept for API compat with earlier callers). */
  lockHue?: boolean;
  /** Compact: render only a swatch; the full picker opens in a popover. */
  compact?: boolean;
  className?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// 2D square axes:
//   Y (top→bottom) = lightness, L_TOP → L_BOTTOM
//   X (left→right) = chroma, 0 → maxChromaInGamut(l, h)
const L_TOP = 0.98;
const L_BOTTOM = 0.10;

interface OKLCHState { l: number; c: number; h: number; }

/** Read a hex into OKLCH, preserving a fallback hue when the color is a
 *  near-gray (chroma ~0) so the hue doesn't collapse to 0. */
function readHex(hex: string, fallbackHue: number): OKLCHState {
  try {
    const o = hexToOklch(hex);
    // Near-neutral: hue is numerically meaningless — keep the prior hue.
    if (o.c < 0.004) return { l: o.l, c: o.c, h: fallbackHue };
    return { l: o.l, c: o.c, h: o.h };
  } catch {
    return { l: 0.6, c: 0.15, h: fallbackHue };
  }
}

/** OKLCH → cursor position (0..1, 0..1) in the square, for the CURRENT hue. */
function toSquarePos(o: OKLCHState): { x: number; y: number } {
  const y = clamp((L_TOP - o.l) / (L_TOP - L_BOTTOM), 0, 1);
  const cMax = maxChromaInGamut(o.l, o.h) || 1e-6;
  const x = clamp(o.c / cMax, 0, 1);
  return { x, y };
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({
  value,
  onChange,
  palette,
  compact = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const swatchRef = useRef<HTMLButtonElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  // AUTHORITATIVE color state. The square/hue edit THIS; we emit hex out.
  // We only re-sync from `value` when it differs from what we last emitted,
  // i.e. a genuine external change — never from our own clamped round-trip.
  const lastEmitted = useRef<string>('');
  const [oklch, setOklch] = useState<OKLCHState>(() => readHex(value, 240));

  useEffect(() => {
    if (value && value.toUpperCase() !== lastEmitted.current.toUpperCase()) {
      setOklch((prev) => readHex(value, prev.h));
    }
  }, [value]);

  const emit = useCallback((next: OKLCHState) => {
    setOklch(next);
    const hex = oklchToHex(next).toUpperCase();
    lastEmitted.current = hex;
    onChange(hex);
  }, [onChange]);

  // ---- Popover positioning (portal — escapes modal overflow:hidden) ----
  const [popStyle, setPopStyle] = useState<React.CSSProperties>({});
  const placePopover = useCallback(() => {
    const el = swatchRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const POP_W = 260;
    const GAP = 8;
    // Align popover's right edge to the swatch's right edge.
    let left = r.right - POP_W;
    left = Math.max(8, Math.min(left, window.innerWidth - POP_W - 8));

    // Measure actual popover height (with fallback if not yet rendered)
    // and flip above the swatch when there isn't room below.
    const popH = popRef.current?.getBoundingClientRect().height ?? 340;
    const spaceBelow = window.innerHeight - r.bottom - GAP;
    const spaceAbove = r.top - GAP;
    const placeAbove = spaceBelow < popH && spaceAbove > spaceBelow;
    const top = placeAbove
      ? Math.max(8, r.top - GAP - popH)
      : r.bottom + GAP;
    setPopStyle({ position: 'fixed', top, left, width: POP_W });
  }, []);

  useEffect(() => {
    if (!open) return;
    placePopover();
    // Re-measure once the popover has actually rendered so its height is known.
    const raf = requestAnimationFrame(() => placePopover());
    const onScroll = () => placePopover();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        wrapRef.current?.contains(t) ||
        popRef.current?.contains(t)
      ) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [open, placePopover]);

  const safeValue = HEX_REGEX.test(value) ? value : oklchToHex(oklch);
  const pos = toSquarePos(oklch);

  // ---- Square interaction: edit l (Y) + c (X), hue stays fixed ----
  const commitFromSquare = useCallback((clientX: number, clientY: number) => {
    const el = squareRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const sx = clamp((clientX - r.left) / r.width, 0, 1);
    const sy = clamp((clientY - r.top) / r.height, 0, 1);
    setOklch((prev) => {
      const l = L_TOP - sy * (L_TOP - L_BOTTOM);
      const cMax = maxChromaInGamut(l, prev.h);
      const c = sx * cMax;
      const next = { l, c, h: prev.h };
      const hex = oklchToHex(next).toUpperCase();
      lastEmitted.current = hex;
      onChange(hex);
      return next;
    });
  }, [onChange]);

  const onSquarePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    commitFromSquare(e.clientX, e.clientY);
    const move = (ev: PointerEvent) => commitFromSquare(ev.clientX, ev.clientY);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const setHue = (h: number) => {
    const hue = ((h % 360) + 360) % 360;
    setOklch((prev) => {
      // Keep the same square position; clamp chroma into the new hue's gamut.
      const p = toSquarePos(prev);
      const cMax = maxChromaInGamut(prev.l, hue);
      const next = { l: prev.l, c: p.x * cMax, h: hue };
      const hex = oklchToHex(next).toUpperCase();
      lastEmitted.current = hex;
      onChange(hex);
      return next;
    });
  };

  const setFromHex = (hex: string) => {
    setOklch((prev) => readHex(hex, prev.h));
    lastEmitted.current = hex.toUpperCase();
    onChange(hex.toUpperCase());
  };

  const hueColor = oklchToHex({ l: 0.62, c: maxChromaInGamut(0.62, oklch.h), h: oklch.h });

  const pickerBody = (
    <>
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
              onClick={() => setFromHex(p.hex)}
            />
          ))}
        </div>
      )}

      <div
        ref={squareRef}
        className="alsa-cpicker__square"
        onPointerDown={onSquarePointerDown}
        style={{ ['--sq-hue' as string]: hueColor }}
        role="slider"
        aria-label="Saturation and lightness"
        aria-valuetext={safeValue}
        tabIndex={0}
      >
        <div className="alsa-cpicker__square-sat" />
        <div className="alsa-cpicker__square-light" />
        <span
          className="alsa-cpicker__square-cursor"
          style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, backgroundColor: safeValue }}
        />
      </div>

      <div className="alsa-cpicker__hue-track" style={{ background: hueStripCss() }}>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={Math.round(oklch.h)}
          onChange={(e) => setHue(parseFloat(e.target.value))}
          className="alsa-cpicker__hue-input"
          aria-label="Hue"
          style={{ ['--thumb-color' as string]: safeValue }}
        />
      </div>

      <HexInput value={safeValue} onChange={setFromHex} />
    </>
  );

  if (compact) {
    return (
      <div ref={wrapRef} className={cn('alsa-cpicker alsa-cpicker--compact', className)}>
        <button
          ref={swatchRef}
          type="button"
          className="alsa-cpicker__swatch"
          style={{ backgroundColor: safeValue }}
          onClick={() => setOpen((s) => !s)}
          aria-label="Open color picker"
          aria-expanded={open}
        />
        {open && typeof document !== 'undefined' && createPortal(
          <div
            ref={popRef}
            className="alsa-cpicker__popover alsa-cpicker__popover--portal"
            role="dialog"
            style={popStyle}
          >
            {pickerBody}
          </div>,
          document.body
        )}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={cn('alsa-cpicker', className)}>
      {pickerBody}
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
