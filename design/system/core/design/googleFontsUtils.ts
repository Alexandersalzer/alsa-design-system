/**
 * Google Fonts API Utilities
 * Fetches available weights for fonts dynamically
 */

// Google Fonts API key - using public API endpoint (no key required for basic metadata)
const GOOGLE_FONTS_API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

// Cache for font metadata to avoid repeated API calls
const fontMetadataCache = new Map<string, FontMetadata>();

export interface FontMetadata {
  family: string;
  availableWeights: number[];
  category: string;
}

/**
 * Fetch font metadata from Google Fonts API
 * Falls back to standard weights if API fails or font not found
 */
export async function getFontMetadata(fontFamily: string): Promise<FontMetadata> {
  // Check cache first
  if (fontMetadataCache.has(fontFamily)) {
    return fontMetadataCache.get(fontFamily)!;
  }

  try {
    // Note: This endpoint works without API key for basic queries
    // For production, consider using your own API key via env variable
    const response = await fetch(`${GOOGLE_FONTS_API_URL}?family=${encodeURIComponent(fontFamily)}`);

    if (!response.ok) {
      console.warn(`[Google Fonts API] Failed to fetch metadata for ${fontFamily}, using fallback weights`);
      return getFallbackMetadata(fontFamily);
    }

    const data = await response.json();
    const fontData = data.items?.find((item: any) => item.family === fontFamily);

    if (!fontData) {
      console.warn(`[Google Fonts API] Font ${fontFamily} not found, using fallback weights`);
      return getFallbackMetadata(fontFamily);
    }

    // Parse available variants to extract numeric weights
    const availableWeights = parseWeightsFromVariants(fontData.variants || []);

    const metadata: FontMetadata = {
      family: fontFamily,
      availableWeights,
      category: fontData.category || 'sans-serif',
    };

    // Cache the result
    fontMetadataCache.set(fontFamily, metadata);

    console.log(`[Google Fonts API] Loaded metadata for ${fontFamily}:`, metadata);
    return metadata;

  } catch (error) {
    console.error(`[Google Fonts API] Error fetching ${fontFamily}:`, error);
    return getFallbackMetadata(fontFamily);
  }
}

/**
 * Parse weight values from Google Fonts variant strings
 * Examples: "regular", "100", "300italic", "700", etc.
 */
function parseWeightsFromVariants(variants: string[]): number[] {
  const weights = new Set<number>();

  variants.forEach(variant => {
    // Remove 'italic' suffix
    const cleanVariant = variant.replace('italic', '').trim();

    if (cleanVariant === 'regular') {
      weights.add(400);
    } else if (cleanVariant === 'bold') {
      weights.add(700);
    } else {
      const numWeight = parseInt(cleanVariant, 10);
      if (!isNaN(numWeight) && numWeight >= 100 && numWeight <= 900) {
        weights.add(numWeight);
      }
    }
  });

  // Convert to sorted array
  return Array.from(weights).sort((a, b) => a - b);
}

/**
 * Fallback to standard font weights if API fails
 */
function getFallbackMetadata(fontFamily: string): FontMetadata {
  // Standard weights that most Google Fonts support
  const standardWeights = [300, 400, 500, 600, 700, 800];

  return {
    family: fontFamily,
    availableWeights: standardWeights,
    category: 'sans-serif',
  };
}

/**
 * Get the closest available weight from a font's available weights
 */
export function getClosestAvailableWeight(
  targetWeight: number,
  availableWeights: number[]
): number {
  if (availableWeights.length === 0) {
    return 400; // Fallback to regular
  }

  if (availableWeights.includes(targetWeight)) {
    return targetWeight;
  }

  // Find closest weight
  return availableWeights.reduce((prev, curr) => {
    return Math.abs(curr - targetWeight) < Math.abs(prev - targetWeight) ? curr : prev;
  });
}

/**
 * Filter weights for body text (lighter weights)
 * Typically 300-500
 */
export function getBodyWeightOptions(availableWeights: number[]): number[] {
  return availableWeights.filter(w => w >= 300 && w <= 500);
}

/**
 * Filter weights for headings (bolder weights)
 * Typically 600-900
 */
export function getHeadingWeightOptions(availableWeights: number[]): number[] {
  return availableWeights.filter(w => w >= 600 && w <= 900);
}

/**
 * Filter weights for labels (medium weights)
 * Typically 400-700
 */
export function getLabelWeightOptions(availableWeights: number[]): number[] {
  return availableWeights.filter(w => w >= 400 && w <= 700);
}

/**
 * Convert numeric weight to CSS weight value
 */
export function weightToCssValue(weight: number): string {
  return weight.toString();
}

/**
 * Get user-friendly label for weight value
 */
export function getWeightLabel(weight: number): string {
  const labels: Record<number, string> = {
    100: 'Thin (100)',
    200: 'Extra Light (200)',
    300: 'Light (300)',
    400: 'Regular (400)',
    500: 'Medium (500)',
    600: 'Semibold (600)',
    700: 'Bold (700)',
    800: 'Extra Bold (800)',
    900: 'Black (900)',
  };

  return labels[weight] || `Weight ${weight}`;
}

/**
 * Batch fetch metadata for multiple fonts
 */
export async function fetchMultipleFontMetadata(
  fontFamilies: string[]
): Promise<Map<string, FontMetadata>> {
  const results = new Map<string, FontMetadata>();

  await Promise.all(
    fontFamilies.map(async (family) => {
      const metadata = await getFontMetadata(family);
      results.set(family, metadata);
    })
  );

  return results;
}

/**
 * Validate that heading weight is greater than body weight
 */
export function validateWeightHierarchy(
  headingWeight: number,
  bodyWeight: number
): { isValid: boolean; message?: string } {
  if (headingWeight <= bodyWeight) {
    return {
      isValid: false,
      message: `Heading weight (${headingWeight}) must be greater than body weight (${bodyWeight})`,
    };
  }

  return { isValid: true };
}

/**
 * Auto-calculate label weight (between body and heading)
 */
export function calculateLabelWeight(
  headingWeight: number,
  bodyWeight: number,
  availableWeights: number[]
): number {
  const midpoint = Math.floor((headingWeight + bodyWeight) / 2);
  return getClosestAvailableWeight(midpoint, availableWeights);
}

/**
 * Preload font metadata for common fonts (call on app init)
 */
export async function preloadCommonFonts() {
  const commonFonts = [
    'Inter', 'Sora', 'Outfit', 'Plus Jakarta Sans', 'DM Sans',
    'Poppins', 'Montserrat', 'Roboto', 'Open Sans'
  ];

  await fetchMultipleFontMetadata(commonFonts);
  console.log('[Google Fonts] Preloaded metadata for common fonts');
}
