export { buildCssVars, designSnippet } from './snippet';
export { getDesignConfig } from './loaders';
export { ThemeSync } from './ThemeSync';
export {
  normalizeWeights,
  getWeightValue,
  validateWeightHierarchy,
  calculateLabelWeight,
  getSafeWeightDefaults,
  getValidHeadingOptions,
  WEIGHT_TIER_MAP,
  WEIGHT_DESCRIPTIONS
} from './weights';
export type { DesignConfig, BodyWeightTier, HeadingWeightTier, WeightTier } from '../types/design';