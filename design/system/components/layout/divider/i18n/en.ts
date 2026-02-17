/**
 * English translations for Divider component
 */

export const dividerTranslations_en = {
  displayName: 'Divider',
  description: 'Visual separator between sections',
  
  props: {
    orientation: {
      displayName: 'Orientation',
      description: 'Horizontal or vertical',
      valueLabels: {
        horizontal: 'Horizontal',
        vertical: 'Vertical',
      },
    },
    weight: {
      displayName: 'Weight',
      description: 'Visual thickness',
      valueLabels: {
        default: 'Default',
        strong: 'Strong',
        emphasis: 'Emphasis',
        inverse: 'Inverse',
      },
    },
    spacing: {
      displayName: 'Spacing',
      description: 'Space around divider',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    label: {
      displayName: 'Label',
      description: 'Optional text in divider',
    },
    labelPosition: {
      displayName: 'Label Position',
      description: 'Where the label is placed',
      valueLabels: {
        left: 'Left',
        center: 'Center',
        right: 'Right',
      },
    },
  },
};
