/**
 * Component Props Schema Definitions
 * This file defines common props that can be used across different component types
 * Used for documentation and reference - not actively enforced
 */

export interface PropDefinition {
  /** The prop name/key */
  name: string;
  /** Data type of the prop */
  type: 'string' | 'boolean' | 'number' | 'array' | 'object';
  /** Whether this prop is required */
  required?: boolean;
  /** Default value if not provided */
  defaultValue?: any;
  /** Description of what this prop does */
  description: string;
  /** Component types that can use this prop */
  usedBy: string[];
  /** Example values */
  examples?: any[];
}

/**
 * Common component props schema
 * These props can be used across multiple component types
 */
export const COMMON_PROPS: PropDefinition[] = [
  {
    name: 'content',
    type: 'string',
    required: true,
    description: 'Main text content displayed by the component',
    usedBy: ['typography', 'button', 'tag', 'link'],
    examples: ['Hello World', 'Click me', 'New Feature']
  },
  {
    name: 'hidden',
    type: 'boolean',
    required: false,
    defaultValue: false,
    description: 'Controls visibility of the component without removing it from JSON',
    usedBy: ['typography', 'button', 'tag', 'link', 'image', 'logo'],
    examples: [true, false]
  },
  {
    name: 'href',
    type: 'string',
    required: false,
    description: 'URL destination for clickable components',
    usedBy: ['button', 'link', 'logo'],
    examples: ['/about', 'https://example.com', 'mailto:hello@example.com']
  },
  {
    name: 'src',
    type: 'string',
    required: true,
    description: 'Source URL for media components',
    usedBy: ['image', 'logo'],
    examples: ['/images/hero.jpg', 'https://cdn.example.com/logo.png']
  },
  {
    name: 'alt',
    type: 'string',
    required: false,
    description: 'Alternative text for accessibility and SEO',
    usedBy: ['image', 'logo'],
    examples: ['Company logo', 'Hero image showing our product']
  },
  {
    name: 'target',
    type: 'string',
    required: false,
    defaultValue: '_self',
    description: 'Link target behavior',
    usedBy: ['button', 'link'],
    examples: ['_self', '_blank', '_parent', '_top']
  },
  {
    name: 'size',
    type: 'string',
    required: false,
    defaultValue: 'medium',
    description: 'Component size variant',
    usedBy: ['button', 'tag', 'typography'],
    examples: ['small', 'medium', 'large', 'xl']
  },
  {
    name: 'variant',
    type: 'string',
    required: false,
    description: 'Visual style variant of the component',
    usedBy: ['button', 'tag'],
    examples: ['primary', 'secondary', 'outline', 'ghost']
  },
  {
    name: 'placeholder',
    type: 'string',
    required: false,
    description: 'Placeholder text for input components',
    usedBy: ['picker', 'input', 'textarea'],
    examples: ['Enter your name', 'Choose an option', 'Type your message']
  },
  {
    name: 'options',
    type: 'array',
    required: false,
    description: 'Array of selectable options for picker components',
    usedBy: ['picker'],
    examples: [[{ value: 'sv', label: 'Svenska' }, { value: 'en', label: 'English' }]]
  },
  {
    name: 'value',
    type: 'string',
    required: false,
    description: 'Current selected value for form components',
    usedBy: ['picker', 'input'],
    examples: ['sv', 'john@example.com', 'selected-option']
  },
  {
    name: 'width',
    type: 'number',
    required: false,
    description: 'Width of the component in pixels',
    usedBy: ['image', 'logo'],
    examples: [300, 150, 600]
  },
  {
    name: 'height',
    type: 'number',
    required: false,
    description: 'Height of the component in pixels',
    usedBy: ['image', 'logo'],
    examples: [200, 100, 400]
  }
];

/**
 * Helper function to get props for a specific component type
 */
export const getPropsForComponent = (componentType: string): PropDefinition[] => {
  return COMMON_PROPS.filter(prop => prop.usedBy.includes(componentType));
};

/**
 * Helper function to check if a prop is valid for a component type
 */
export const isPropValidForComponent = (propName: string, componentType: string): boolean => {
  const prop = COMMON_PROPS.find(p => p.name === propName);
  return prop ? prop.usedBy.includes(componentType) : false;
};