// ===============================================
// src/design-system/components/patterns/selection/index.ts
// Complete Selection Patterns Index - Fixed with SelectionCardGroup
// ===============================================

// SelectionCard exports
export { SelectionCard, SelectionCardGroup } from './SelectionCard';
export type { SelectionCardProps, SelectionCardGroupProps } from './SelectionCard';

// ColorPicker exports
export { ColorPicker } from './ColorPicker';
export type { ColorPickerProps, ColorOption } from './ColorPicker';

// ChoiceGroup exports
export { ChoiceGroup } from './ChoiceGroup';
export type { ChoiceGroupProps, ChoiceOption } from './ChoiceGroup';

// OptionGrid exports
export {
  OptionGrid,
  OptionSection,
  OptionGridSection
} from './OptionGrid';
export type {
  OptionGridProps,
  OptionSectionProps,
  OptionGridSectionProps,
  OptionItem
} from './OptionGrid';

// CheckboxCard exports
export { CheckboxCard, CheckboxCardGroup } from './CheckboxCard';
export type { CheckboxCardProps, CheckboxCardGroupProps } from './CheckboxCard';

// RadioCard exports - Updated to include both components
export { RadioCard, RadioCardRoot, RadioCardItem } from './RadioCard';
export type { RadioCardItemProps, RadioCardRootProps } from './RadioCard';

export * from './DesignRadioCard'