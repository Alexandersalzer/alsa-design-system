/**
 * Symmetric Color Scale Generator
 * Creates perfectly mirrored scales where:
 * - Gap 0→100 = Gap 1300→1400
 * - Gap 100→200 = Gap 1200→1300
 * - Smaller gaps at edges (0-500, 1000-1400) for critical UI
 * - Larger gaps in middle (500-900) for less critical colors
 */

function hslToHex(h, s, l) {
  s = s / 100;
  l = l / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r, g, b;
  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
  else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
  else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
  else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (n) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Symmetric gaps - same on both ends
const gaps = [
  4.0,  // 0→100 and 1300→1400 (SMALLEST - critical UI)
  5.0,  // 100→200 and 1200→1300
  6.0,  // 200→300 and 1100→1200
  7.0,  // 300→400 and 1000→1100
  8.0,  // 400→500 and 900→1000
  9.0,  // 500→600 and 800→900
  10.0, // 600→700 and 700→800 (LARGEST - middle)
];

function generateSymmetricScale(maxL, minL) {
  const scale = new Array(15);

  // Build from light end (0, 100, 200...)
  scale[0] = maxL;
  for (let i = 1; i <= 7; i++) {
    scale[i] = scale[i-1] - gaps[i-1];
  }

  // Build from dark end (1400, 1300, 1200...) - MIRROR the gaps
  scale[14] = minL;
  for (let i = 13; i >= 7; i--) {
    scale[i] = scale[i+1] + gaps[14-i-1];
  }

  return scale;
}

// All theme tones
const tones = {
  // MONOCHROME
  pure: { h: 0, s: 0, minL: 0, maxL: 100 },
  graphite: { h: 0, s: 1, minL: 5, maxL: 97 },
  mono: { h: 0, s: 2, minL: 5, maxL: 97 },
  charcoal: { h: 30, s: 2, minL: 5, maxL: 97 },
  steel: { h: 210, s: 3, minL: 5, maxL: 97 },
  slate: { h: 210, s: 6, minL: 5, maxL: 97 },

  // SUBTLE
  aqua: { h: 200, s: 25, minL: 5, maxL: 97 },
  ink: { h: 220, s: 22, minL: 5, maxL: 97 },
  frost: { h: 190, s: 20, minL: 5, maxL: 97 },
  violet: { h: 270, s: 18, minL: 5, maxL: 97 },
  sage: { h: 120, s: 16, minL: 5, maxL: 97 },
  pearl: { h: 40, s: 12, minL: 5, maxL: 97 },
  linen: { h: 35, s: 20, minL: 5, maxL: 97 },
  ember: { h: 20, s: 25, minL: 5, maxL: 97 },
};

console.log('Generating symmetric color scales...\n');

Object.entries(tones).forEach(([name, { h, s, minL, maxL }]) => {
  console.log(`${name.toUpperCase()} (H=${h}°, S=${s}%, L: ${maxL}% → ${minL}%):`);
  const scale = generateSymmetricScale(maxL, minL);

  scale.forEach((L, i) => {
    const step = i * 100;
    const hex = hslToHex(h, s, L);
    const padding = step === 0 ? '   ' : step < 1000 ? '  ' : ' ';
    console.log(`  --foundation-gray-${step}:${padding}${hex};  /* L=${L.toFixed(1)}% */`);
  });

  console.log('');
});
