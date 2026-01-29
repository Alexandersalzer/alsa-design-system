import React, { useEffect, useRef } from 'react';
import styles from './GenerativeBackground.module.css';

interface GenerativeBackgroundProps {
  variant?: 'subtle' | 'medium' | 'vibrant';
  seed?: number;
}

// Deterministisk PRNG (seedad)
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Simple value noise (billig "perlin-ish")
function smoothstep(t: number): number { 
  return t * t * (3 - 2 * t); 
}

function lerp(a: number, b: number, t: number): number { 
  return a + (b - a) * t; 
}

function makeGridNoise(rand: () => number, gw: number, gh: number): Float32Array {
  const g = new Float32Array(gw * gh);
  for (let i = 0; i < g.length; i++) g[i] = rand();
  return g;
}

function sampleGrid(grid: Float32Array, gw: number, gh: number, x: number, y: number): number {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const x1 = x0 + 1, y1 = y0 + 1;

  const sx = smoothstep(x - x0);
  const sy = smoothstep(y - y0);

  function at(ix: number, iy: number): number {
    const cx = Math.max(0, Math.min(gw - 1, ix));
    const cy = Math.max(0, Math.min(gh - 1, iy));
    return grid[cy * gw + cx];
  }

  const n00 = at(x0, y0);
  const n10 = at(x1, y0);
  const n01 = at(x0, y1);
  const n11 = at(x1, y1);

  const ix0 = lerp(n00, n10, sx);
  const ix1 = lerp(n01, n11, sx);
  return lerp(ix0, ix1, sy);
}

// Fractal noise (FBM)
function fbm(grid: Float32Array, gw: number, gh: number, x: number, y: number): number {
  let amp = 1.0, freq = 1.0;
  let sum = 0.0, norm = 0.0;

  for (let o = 0; o < 5; o++) {
    const v = sampleGrid(grid, gw, gh, x * freq, y * freq);
    sum += v * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.0;
  }
  return sum / norm;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  const m = clean.match(/.{2}/g);
  if (!m) return { r: 255, g: 255, b: 255 };
  return { 
    r: parseInt(m[0], 16), 
    g: parseInt(m[1], 16), 
    b: parseInt(m[2], 16) 
  };
}

function mix(c1: RGB, c2: RGB, t: number): RGB {
  return {
    r: Math.round(lerp(c1.r, c2.r, t)),
    g: Math.round(lerp(c1.g, c2.g, t)),
    b: Math.round(lerp(c1.b, c2.b, t)),
  };
}

function drawGenerativeBackground(
  canvas: HTMLCanvasElement, 
  seed: number, 
  colorBase: string, 
  colorAccent: string, 
  colorHighlight: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Rendera i "riktig" upplösning
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = Math.floor(window.innerWidth * dpr);
  const H = Math.floor(window.innerHeight * dpr);
  canvas.width = W;
  canvas.height = H;

  const rand = mulberry32(seed);

  // Konvertera design tokens till RGB
  const purpleA = hexToRgb(colorBase);
  const purpleB = hexToRgb(colorAccent);
  const whiteish = hexToRgb(colorHighlight);

  // Noise-grid
  const gw = 256, gh = 256;
  const grid = makeGridNoise(rand, gw, gh);

  const img = ctx.createImageData(W, H);
  const data = img.data;

  // Skala noise så "fläckarna" blir stora och mjuka
  const scale = 0.008;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x * scale;
      const ny = y * scale;

      const n = fbm(grid, gw, gh, nx, ny);

      // Skapa "fläckmask"
      const blobs = Math.max(0, (n - 0.35) / 0.65);
      const soft = smoothstep(blobs);

      // Lätt extra grain
      const grain = (rand() - 0.5) * 0.06;

      // Färgblandning
      const baseMix = 0.35 + n * 0.35;
      let col = mix(purpleA, purpleB, baseMix);
      col = mix(col, whiteish, soft * 0.75);

      // Applicera grain
      const r = Math.max(0, Math.min(255, col.r * (1 + grain)));
      const g = Math.max(0, Math.min(255, col.g * (1 + grain)));
      const b = Math.max(0, Math.min(255, col.b * (1 + grain)));

      const i = (y * W + x) * 4;
      data[i + 0] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);

  // Mjuk blur över allt (vattenfärg-känsla)
  const temp = document.createElement("canvas");
  temp.width = W; 
  temp.height = H;
  const tctx = temp.getContext("2d");
  if (!tctx) return;
  
  tctx.drawImage(canvas, 0, 0);

  ctx.clearRect(0, 0, W, H);
  ctx.filter = `blur(${Math.round(18 * dpr)}px)`;
  ctx.drawImage(temp, 0, 0);
  ctx.filter = "none";

  // Lätt vignette för djup
  const grad = ctx.createRadialGradient(
    W * 0.5, H * 0.45, Math.min(W, H) * 0.1, 
    W * 0.5, H * 0.45, Math.max(W, H) * 0.7
  );
  grad.addColorStop(0, "rgba(255,255,255,0.00)");
  grad.addColorStop(1, "rgba(255,255,255,0.22)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

export const GenerativeBackground: React.FC<GenerativeBackgroundProps> = ({ 
  variant = 'subtle',
  seed = 1337 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Hämta design tokens från CSS custom properties
    const computedStyle = getComputedStyle(canvas);
    const colorBase = computedStyle.getPropertyValue('--gen-bg-base').trim() || '#E9D7FF';
    const colorAccent = computedStyle.getPropertyValue('--gen-bg-accent').trim() || '#D8C8FF';
    const colorHighlight = computedStyle.getPropertyValue('--gen-bg-highlight').trim() || '#FBF7FF';

    const draw = () => {
      drawGenerativeBackground(canvas, seed, colorBase, colorAccent, colorHighlight);
    };

    draw();

    const handleResize = () => {
      draw();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [variant, seed]);

  return <canvas ref={canvasRef} className={styles[variant]} />;
};
