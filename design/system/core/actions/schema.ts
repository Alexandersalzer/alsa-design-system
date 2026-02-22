/**
 * Action Schema System
 * 
 * Reusable action configuration for components that trigger actions.
 * Supports navigation, booking, contact forms, newsletters, etc.
 */

import type { ObjectPropConfig } from '../schemas/shared';

/**
 * Create action prop configuration for components
 * Returns a PropConfig that can be used in any component schema
 * 
 * @example
 * ```typescript
 * import { createActionPropConfig } from '../../../core/actions/schema';
 * 
 * export const buttonSchema = {
 *   props: {
 *     content: { ... },
 *     action: createActionPropConfig(),
 *   }
 * };
 * ```
 */
export function createActionPropConfig(): ObjectPropConfig {
  return {
    name: 'action',
    displayName: 'Action',
    description: 'What should happen when this component is clicked?',
    type: 'object',
    required: false,
    editorType: 'action-builder', // Custom editor type handled by ActionBuilder component
    group: 'behavior',
    cmsEnabled: true,
    additionalProperties: true,
    
    properties: {
      type: {
        name: 'type',
        displayName: 'Action Type',
        description: 'Type of action to trigger',
        type: 'enum',
        required: true,
        values: ['navigation', 'booking', 'contact', 'newsletter'] as const,
        valueLabels: {
          navigation: 'Navigate',
          booking: 'Open Booking Modal',
          contact: 'Submit Contact Form',
          newsletter: 'Newsletter Signup',
        },
        editorType: 'select',
        cmsEnabled: true,
      },
      
      settings: {
        name: 'settings',
        displayName: 'Settings',
        description: 'Action-specific settings',
        type: 'object',
        required: true,
        editorType: 'json', // Settings are dynamically handled by ActionBuilder
        additionalProperties: true,
        cmsEnabled: true,
      },
    },
  };
}

/**
 * Type guards for action settings
 */
export interface NavigationSettings {
  navigationType?: 'section' | 'page' | 'external';
  sectionId?: string;
  pageId?: string;
  href?: string;
  openInNewTab?: boolean;
  scrollToTop?: boolean;
}

export interface BookingSettings {
  calendlyUrl?: string;
  calUrl?: string;
  primaryColor?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export interface ContactSettings {
  redirectAfterSubmit?: string;
  clearFormOnSuccess?: boolean;
}

export interface NewsletterSettings {
  listId?: string;
  doubleOptIn?: boolean;
  tags?: string[];
  redirectAfterSubmit?: string;
}
