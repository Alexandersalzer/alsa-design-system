/**
 * Hero Section Schema
 * 
 * Defines layout configuration for hero sections.
 * Heroes are landing sections with primary call-to-action.
 */

import type { SectionSchema } from '../section-schema.types';
import { defaultSectionLayoutProps, defaultSectionSchemaBase } from '../section-layout.schema';

export const heroSectionSchema: SectionSchema = {
  $id: 'hero',
  displayName: 'Hero Section',
  category: 'hero',
  description: 'Landing section with primary call-to-action',
  icon: 'Sparkles',
  version: '1.0.0',
  cmsEnabled: true,
  
  // Hero-specific layout props
  layoutProps: {
    ...defaultSectionLayoutProps,
    
    // Override alignSectionHeader to prefer center
    alignSectionHeader: {
      ...defaultSectionLayoutProps.alignSectionHeader,
      default: 'center',
      description: 'Hero sections typically center-align for maximum impact'
    }
  },
  
  // Hero-specific defaults
  defaultLayout: {
    ...defaultSectionSchemaBase.defaultLayout,
    alignSectionHeader: 'center',
    verticalAlign: 'center'
  },
  
  // Inherit base validation
  validation: defaultSectionSchemaBase.validation,
  
  examples: [
    {
      name: 'Centered Hero',
      description: 'Classic centered hero with CTA',
      category: 'common',
      layout: {
        alignSectionHeader: 'center'
      }
    },
    {
      name: 'Split Hero with Media',
      description: 'Hero with image/video in right column',
      category: 'media',
      layout: {
        alignSectionHeader: 'left',
        secondColumn: ['media_hero01'],
        ratio: '1:1',
        verticalAlign: 'center'
      }
    }
  ],
  
  related: ['cta'],
  docsUrl: '/docs/sections/hero'
};
