/**
 * Color Scale Generator
 * Generates HSL-based color scales with balanced perceptual distribution
 *
 * Using exponent 1.3 for better balance between light and dark modes:
 * - Exponent 1.0 (linear): Perfect for light mode, compressed dark mode
 * - Exponent 1.8: Perfect for dark mode, compressed light mode
 * - Exponent 1.3: Balanced compromise for both modes
 */

function hslToHex(h, s, l) {
  // Normalize inputs
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r, g, b;
  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  // Convert to hex
  const toHex = (n) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generateColorScale(h, s, minL, maxL, exponent = 1.3) {
  const steps = [];
  const range = maxL - minL;

  for (let stepIndex = 0; stepIndex < 15; stepIndex++) {
    const stepName = stepIndex * 100;

    // Perceptual curve: L = maxL - (range × (stepIndex/14)^exponent)
    const normalizedStep = stepIndex / 14;
    const lightness = maxL - (range * Math.pow(normalizedStep, exponent));

    const hex = hslToHex(h, s, lightness);

    steps.push({
      step: stepName,
      lightness: lightness.toFixed(3),
      hex
    });
  }

  return steps;
}

// Define all theme tones
const themeTones = {
  // MONOCHROME
  pure: { h: 0, s: 0, minL: 0, maxL: 100 },
  graphite: { h: 0, s: 1, minL: 5, maxL: 97 },
  mono: { h: 0, s: 2, minL: 5, maxL: 97 },
  charcoal: { h: 30, s: 2, minL: 5, maxL: 97 },
  steel: { h: 210, s: 3, minL: 5, maxL: 97 },
  slate: { h: 210, s: 6, minL: 5, maxL: 97 },

  // SUBTLE
  aqua: { h: 200, s: 15, minL: 5, maxL: 97 },
  ink: { h: 220, s: 12, minL: 5, maxL: 97 },
  frost: { h: 190, s: 10, minL: 5, maxL: 97 },
  violet: { h: 270, s: 10, minL: 5, maxL: 97 },
  sage: { h: 120, s: 8, minL: 5, maxL: 97 },
  pearl: { h: 40, s: 5, minL: 5, maxL: 97 },
  ember: { h: 20, s: 12, minL: 5, maxL: 97 }
};

// Generate CSS output for a tone
function generateToneCSS(toneName, toneData) {
  const steps = generateColorScale(
    toneData.h,
    toneData.s,
    toneData.minL,
    toneData.maxL,
    1.3 // Balanced exponent
  );

  let css = '';
  steps.forEach(({ step, lightness, hex }) => {
    const padding = step === 0 ? '   ' : step < 1000 ? '  ' : ' ';
    const comment = step === 0 ? ' /* L=' + lightness + '% - Lightest */' :
                   step === 1400 ? ' /* L=' + lightness + '% - Darkest */' :
                   step === 700 ? ' /* L=' + lightness + '% - MIDDLE */' :
                   ' /* L=' + lightness + '% */';

    css += `  --foundation-gray-${step}:${padding}${hex};${comment}\n`;
  });

  return css;
}

// Generate all tones
console.log('='.repeat(60));
console.log('COLOR SCALE GENERATOR - Exponent 1.3 (Balanced)');
console.log('='.repeat(60));
console.log();

Object.entries(themeTones).forEach(([toneName, toneData]) => {
  console.log(`/* ========== ${toneName.toUpperCase()} ========== */`);
  console.log(`/* HSL: H=${toneData.h}°, S=${toneData.s}%, L: ${toneData.maxL}% → ${toneData.minL}% */`);
  console.log();
  console.log(generateToneCSS(toneName, toneData));
  console.log();
});

// Also generate comparison table
console.log('='.repeat(60));
console.log('LIGHTNESS COMPARISON');
console.log('='.repeat(60));
console.log();
console.log('Step | Exp 1.0 | Exp 1.3 | Exp 1.8 | Description');
console.log('-----|---------|---------|---------|------------');

for (let stepIndex = 0; stepIndex < 15; stepIndex++) {
  const step = stepIndex * 100;
  const normalizedStep = stepIndex / 14;

  const linear = 97 - (92 * normalizedStep);
  const exp13 = 97 - (92 * Math.pow(normalizedStep, 1.3));
  const exp18 = 97 - (92 * Math.pow(normalizedStep, 1.8));

  const desc = step === 0 ? 'Lightest' :
               step === 700 ? 'MIDDLE' :
               step === 1400 ? 'Darkest' : '';

  console.log(
    `${step.toString().padEnd(4)} | ` +
    `${linear.toFixed(1).padEnd(7)} | ` +
    `${exp13.toFixed(1).padEnd(7)} | ` +
    `${exp18.toFixed(1).padEnd(7)} | ` +
    desc
  );
}
