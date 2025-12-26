/**
 * Color Scale Generator - Exponent 1.2 (OPTIMIZED)
 * Better distribution for UI surfaces:
 * - Tighter spacing at dark end (1200-1400) for backgrounds/cards
 * - Tighter spacing at light end (0-300) for surfaces/hovers
 * - Still maintains even distribution overall
 */

function hslToHex(h, s, l) {
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

  const toHex = (n) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generateColorScale(h, s, minL, maxL, exponent = 1.2) {
  const steps = [];
  const range = maxL - minL;

  for (let stepIndex = 0; stepIndex < 15; stepIndex++) {
    const stepName = stepIndex * 100;
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

// MONOCHROME
const monochrome = {
  pure: { h: 0, s: 0, minL: 0, maxL: 100 },
  graphite: { h: 0, s: 1, minL: 5, maxL: 97 },
  mono: { h: 0, s: 2, minL: 5, maxL: 97 },
  charcoal: { h: 30, s: 2, minL: 5, maxL: 97 },
  steel: { h: 210, s: 3, minL: 5, maxL: 97 },
  slate: { h: 210, s: 6, minL: 5, maxL: 97 },
};

// SUBTLE (HIGHER SATURATION)
const subtle = {
  aqua: { h: 200, s: 25, minL: 5, maxL: 97 },
  ink: { h: 220, s: 22, minL: 5, maxL: 97 },
  frost: { h: 190, s: 20, minL: 5, maxL: 97 },
  violet: { h: 270, s: 18, minL: 5, maxL: 97 },
  sage: { h: 120, s: 16, minL: 5, maxL: 97 },
  pearl: { h: 40, s: 12, minL: 5, maxL: 97 },
  linen: { h: 35, s: 20, minL: 5, maxL: 97 },
  ember: { h: 20, s: 25, minL: 5, maxL: 97 },
};

console.log('='.repeat(80));
console.log('LIGHTNESS COMPARISON - Exponent 1.2 vs 1.3');
console.log('='.repeat(80));
console.log();
console.log('Step | Exp 1.2 (NEW) | Exp 1.3 (OLD) | Difference | Notes');
console.log('-----|---------------|---------------|------------|-------');

for (let stepIndex = 0; stepIndex < 15; stepIndex++) {
  const step = stepIndex * 100;
  const normalizedStep = stepIndex / 14;

  const exp12 = 97 - (92 * Math.pow(normalizedStep, 1.2));
  const exp13 = 97 - (92 * Math.pow(normalizedStep, 1.3));
  const diff = (exp12 - exp13).toFixed(1);

  let notes = '';
  if (step >= 0 && step <= 300) notes = 'Light surfaces/hovers';
  if (step >= 1200 && step <= 1400) notes = 'Dark backgrounds/cards';

  console.log(
    `${step.toString().padEnd(4)} | ` +
    `${exp12.toFixed(1).padEnd(13)} | ` +
    `${exp13.toFixed(1).padEnd(13)} | ` +
    `${diff.padStart(10)} | ` +
    notes
  );
}

console.log();
console.log('='.repeat(80));
console.log('KEY OBSERVATIONS:');
console.log('='.repeat(80));
console.log('- Steps 1200→1300→1400: TIGHTER gaps (better for dark backgrounds)');
console.log('- Steps 0→100→200→300: TIGHTER gaps (better for light surfaces)');
console.log('- Overall: More even distribution across the entire scale');
console.log();

// Generate sample output for Mono tone
console.log('='.repeat(80));
console.log('SAMPLE OUTPUT - MONO TONE (Exponent 1.2)');
console.log('='.repeat(80));
console.log();

const monoSteps = generateColorScale(
  monochrome.mono.h,
  monochrome.mono.s,
  monochrome.mono.minL,
  monochrome.mono.maxL,
  1.2
);

monoSteps.forEach(({ step, lightness, hex }) => {
  const padding = step === 0 ? '   ' : step < 1000 ? '  ' : ' ';
  console.log(`  --foundation-gray-${step}:${padding}${hex};  /* L=${lightness}% */`);
});
