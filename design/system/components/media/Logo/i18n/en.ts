/**
 * English translations for LogoText component
 */

export const logotextTranslations_en = {
  displayName: 'Logo Text',
  description: 'Branded text for logos and headings',
  
  props: {
    content: {
      displayName: 'Text',
      description: 'Text content for the logo',
    },
    size: {
      displayName: 'Size',
      description: 'Text size',
      valueLabels: {
        xs: 'Extra Small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
        '2xl': 'Double Extra Large',
      },
    },
    weight: {
      displayName: 'Weight',
      description: 'Font weight',
      valueLabels: {
        normal: 'Normal',
        medium: 'Medium',
        semibold: 'Semi Bold',
        bold: 'Bold',
        extrabold: 'Extra Bold',
        black: 'Black',
      },
    },
    transform: {
      displayName: 'Transform',
      description: 'Text case transformation',
      valueLabels: {
        none: 'None',
        uppercase: 'Uppercase',
        lowercase: 'Lowercase',
        capitalize: 'Capitalize',
      },
    },
    spacing: {
      displayName: 'Letter Spacing',
      description: 'Space between letters',
      valueLabels: {
        normal: 'Normal',
        tight: 'Tight',
        wide: 'Wide',
        wider: 'Wider',
        widest: 'Widest',
      },
    },
    color: {
      displayName: 'Color',
      description: 'Color variant',
      valueLabels: {
        primary: 'Primary',
        secondary: 'Secondary',
        inverse: 'Inverse',
        inherit: 'Inherit',
      },
    },
    font: {
      displayName: 'Font',
      description: 'Font family',
      valueLabels: {
        brand: 'Brand',
        heading: 'Heading',
        body: 'Body',
        mono: 'Monospace',
      },
    },
    gradient: {
      displayName: 'Gradient',
      description: 'Enable gradient effect',
    },
    gradientDirection: {
      displayName: 'Gradient Direction',
      description: 'Direction of gradient',
      valueLabels: {
        'to-r': 'To Right',
        'to-br': 'To Bottom Right',
        'to-b': 'To Bottom',
        'to-bl': 'To Bottom Left',
        'to-l': 'To Left',
      },
    },
    hover: {
      displayName: 'Hover Effect',
      description: 'Enable hover effect',
    },
  },
};
