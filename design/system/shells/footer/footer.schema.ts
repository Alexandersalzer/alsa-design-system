/**
 * Footer Section Schema
 *
 * Defines editable props for the footer section.
 * Used by FooterLayoutEditor in im-dashboard to render schema-driven controls.
 *
 * Props live at: footerData[sectionKey].props
 */

import type { PropConfig } from '../../core/schemas/shared';

export interface FooterSectionSchema {
  $id: string;
  displayName: string;
  layoutProps: Record<string, PropConfig>;
}

export const footerSectionSchema: FooterSectionSchema = {
  $id: 'footer',
  displayName: 'Footer',

  layoutProps: {
    background: {
      name: 'background',
      type: 'enum',
      displayName: 'Background',
      description: 'Background style of the footer',
      editorType: 'select',
      values: ['default', 'subtle', 'emphasis', 'accent', 'inverted'],
      valueLabels: {
        default: 'Default',
        subtle: 'Subtle',
        emphasis: 'Emphasis',
        accent: 'Accent',
        inverted: 'Inverted',
      },
      default: 'default',
      group: 'style',
      cmsEnabled: true,
    },

    borderTop: {
      name: 'borderTop',
      type: 'boolean',
      displayName: 'Top border',
      description: 'Show a border at the top of the footer',
      editorType: 'toggle',
      default: true,
      group: 'style',
      cmsEnabled: true,
    },

    logoDisplay: {
      name: 'logoDisplay',
      type: 'enum',
      displayName: 'Logo',
      description: 'Choose what to display in the logo area',
      editorType: 'segmented',
      values: ['both', 'logo', 'text', 'none'],
      valueLabels: { both: 'Both', logo: 'Icon', text: 'Text', none: 'None' },
      default: 'both',
      group: 'logo',
      cmsEnabled: true,
    },

    contentAlign: {
      name: 'contentAlign',
      type: 'enum',
      displayName: 'Alignment',
      description: 'Horizontal alignment of footer content',
      editorType: 'segmented',
      values: ['start', 'center', 'end'],
      valueLabels: { start: 'Left', center: 'Center', end: 'Right' },
      default: 'center',
      group: 'layout',
      cmsEnabled: true,
    },
  },
};

export function getFooterSectionSchema(): FooterSectionSchema {
  return footerSectionSchema;
}
