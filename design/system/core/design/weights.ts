import type { BodyWeightTier, HeadingWeightTier, WeightTier } from "../types/design";

/**
 * Font Weight Tier System
 * Strict 400-800 range with validation
 * Ensures headings are always bolder than body text
 */

// Weight tier to numeric mapping (400-800 only)
export const WEIGHT_TIER_MAP: Record<WeightTier, number> = {
  // Body text weights (lighter)
  regular: 400,
  medium: 500,

  // Heading weights (bolder)
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

// Reverse mapping for debugging
export const NUMERIC_TO_TIER: Record<number, WeightTier> = {
  400: 'regular',
  500: 'medium',
  600: 'semibold',
  700: 'bold',
  800: 'extrabold',
} as const;

/**
 * Get numeric weight from tier
 */
export function getWeightValue(tier: WeightTier): number {
  return WEIGHT_TIER_MAP[tier] || 400;
}

/**
 * Validates that heading weight is bolder than body weight
 */
export function validateWeightHierarchy(
  heading: HeadingWeightTier,
  body: BodyWeightTier
): boolean {
  const headingValue = getWeightValue(heading);
  const bodyValue = getWeightValue(body);
  return headingValue > bodyValue;
}

/**
 * Auto-calculate label weight (sits between body and heading)
 */
export function calculateLabelWeight(
  heading: HeadingWeightTier,
  body: BodyWeightTier
): WeightTier {
  const headingValue = getWeightValue(heading);
  const bodyValue = getWeightValue(body);

  // Label should be between body and heading
  const labelValue = Math.floor((headingValue + bodyValue) / 2);

  // Map to closest tier
  if (labelValue <= 400) return 'regular';
  if (labelValue <= 500) return 'medium';
  if (labelValue <= 600) return 'semibold';
  if (labelValue <= 700) return 'bold';
  return 'extrabold';
}

/**
 * Get safe defaults with validation
 */
export function getSafeWeightDefaults(): {
  heading: HeadingWeightTier;
  body: BodyWeightTier;
  label: WeightTier;
} {
  const heading: HeadingWeightTier = 'bold'; // 700
  const body: BodyWeightTier = 'regular'; // 400
  const label = calculateLabelWeight(heading, body); // 'medium' (500)

  return { heading, body, label };
}

/**
 * Validate and fix weight configuration
 * Returns valid weights, fixing invalid combinations
 */
export function normalizeWeights(
  heading?: HeadingWeightTier,
  body?: BodyWeightTier
): {
  heading: HeadingWeightTier;
  body: BodyWeightTier;
  label: WeightTier;
  isValid: boolean;
} {
  // Use defaults if not provided
  const defaults = getSafeWeightDefaults();
  const finalHeading = heading || defaults.heading;
  const finalBody = body || defaults.body;

  // Validate hierarchy
  const isValid = validateWeightHierarchy(finalHeading, finalBody);

  // If invalid, use safe defaults
  if (!isValid) {
    console.warn(
      `[Font Weights] Invalid combination: heading="${finalHeading}" (${getWeightValue(finalHeading)}) must be > body="${finalBody}" (${getWeightValue(finalBody)}). Using defaults.`
    );
    return {
      ...defaults,
      isValid: false
    };
  }

  // Calculate label weight
  const label = calculateLabelWeight(finalHeading, finalBody);

  return {
    heading: finalHeading,
    body: finalBody,
    label,
    isValid: true
  };
}

/**
 * Get all valid heading options for a given body weight
 */
export function getValidHeadingOptions(body: BodyWeightTier): HeadingWeightTier[] {
  const bodyValue = getWeightValue(body);
  const allHeadingTiers: HeadingWeightTier[] = ['semibold', 'bold', 'extrabold'];

  return allHeadingTiers.filter(tier => getWeightValue(tier) > bodyValue);
}

/**
 * User-friendly weight descriptions
 */
export const WEIGHT_DESCRIPTIONS: Record<WeightTier, string> = {
  regular: 'Regular (400) - Standard body text',
  medium: 'Medium (500) - Slightly emphasized body text',
  semibold: 'Semibold (600) - Subtle headings',
  bold: 'Bold (700) - Strong headings',
  extrabold: 'Extra Bold (800) - Maximum impact headings',
} as const;
