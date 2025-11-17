/**
 * Not used yet
 * Component Props Schema Definitions
 * This file defines common props that can be used across different component types
 * Used for documentation and reference - not actively enforced
 */

import { PropDefinition } from "./types";
/**
 * Common component props schema
 * These props can be used across multiple component types
 */
export const ComponentProps: PropDefinition[] = [
  {
    name: 'content',
    type: 'string',
    required: true,
    description: 'Main text content displayed by the component',
    usedBy: ['typography', 'button', 'tag', 'link']
  },
  {
    name: 'hidden',
    type: 'boolean',
    required: false,
    defaultValue: false,
    description: 'Controls visibility of the component without removing it from JSON',
    usedBy: ['*']
  },
  {
    name: 'href',
    type: 'string',
    required: false,
    description: 'URL destination for clickable components',
    usedBy: ['button', 'link', 'logo']
  },
  {
    name: 'src',
    type: 'string',
    required: true,
    description: 'Source URL for media components',
    usedBy: ['image', 'logo']
  },
  {
    name: 'alt',
    type: 'string',
    required: false,
    description: 'Alternative text for accessibility and SEO',
    usedBy: ['image', 'logo']
  },
  {
    name: 'target',
    type: 'string',
    required: false,
    defaultValue: '_self',
    description: 'Link target behavior',
    usedBy: ['button', 'link']
  },
  {
    name: 'variant',
    type: 'string',
    required: false,
    description: 'Visual style variant of the component',
    usedBy: ['button']
  },
  {
    name: 'placeholder',
    type: 'string',
    required: false,
    description: 'Placeholder text for input components',
    usedBy: ['picker', 'input', 'textarea']
  },
  {
    name: 'options',
    type: 'array',
    required: false,
    description: 'Array of selectable options for picker components',
    usedBy: ['picker']
  },
  {
    name: 'value',
    type: 'string',
    required: false,
    description: 'Current selected value for form components',
    usedBy: ['picker', 'input']
  }
];