/**
 * English translations for Accordion component
 */

export const accordionTranslations_en = {
  displayName: 'Accordion',
  description: 'Vertically stacked collapsible sections',
  
  props: {
    selectionMode: {
      displayName: 'Selection Mode',
      description: 'How many sections can be open at once',
      valueLabels: {
        single: 'Single Section',
        multiple: 'Multiple Sections',
      },
    },
    variant: {
      displayName: 'Variant',
      description: 'Visual style',
      valueLabels: {
        default: 'Default',
        separated: 'Separated',
        bordered: 'Bordered',
        sunken: 'Sunken',
        borderless: 'Borderless',
        list: 'List',
      },
    },
    radius: {
      displayName: 'Border Radius',
      description: 'Rounded corners',
      valueLabels: {
        none: 'None',
        xs: 'Extra Small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
        '2xl': '2X Large',
      },
    },
    radiusMode: {
      displayName: 'Radius Mode',
      description: 'How radius is applied',
      valueLabels: {
        edges: 'Edges',
        all: 'All',
        none: 'None',
      },
    },
    gap: {
      displayName: 'Gap',
      description: 'Space between elements',
      valueLabels: {
        none: 'None',
        xs: 'Extra Small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    size: {
      displayName: 'Size',
      description: 'Size of padding and spacing',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    showIndicator: {
      displayName: 'Show Indicator',
      description: 'Show/hide chevron indicators',
    },
  },
};

export const accordionItemTranslations_en = {
  displayName: 'Accordion Item',
  description: 'A single collapsible item within an accordion',
  defaultTitle: 'Question title',
  defaultContent: 'Write your answer here. Provide clear and useful information for your visitors.',
  
  props: {
    itemKey: {
      displayName: 'Key',
      description: 'Unique identifier for the item',
    },
    title: {
      displayName: 'Title',
      description: 'Main title always visible',
    },
    subtitle: {
      displayName: 'Subtitle',
      description: 'Optional subtitle below the title',
    },
    content: {
      displayName: 'Content',
      description: 'Content shown when item is expanded',
    },
    disabled: {
      displayName: 'Disabled',
      description: 'Disable the item',
    },
    disableIndicator: {
      displayName: 'Hide Indicator',
      description: 'Hide the chevron indicator for this item',
    },
  },
};
