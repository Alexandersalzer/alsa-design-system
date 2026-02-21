/**
 * Accordion Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { accordionTranslations, accordionItemTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createAccordionSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(accordionTranslations, locale);
  
  return {
    $id: 'accordion',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'Bars3',
    tags: ['accordion', 'collapsible', 'layout', 'disclosure'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      selectionMode: 'single',
      variant: 'default',
      radius: 'md',
      radiusMode: 'edges',
      gap: 'none',
      size: 'md',
      showIndicator: true,
    },
    
    props: {
      selectionMode: createLocalizedProp(
        {
          name: 'selectionMode',
          type: 'enum',
          required: false,
          default: 'single',
          editorType: 'segmented',
          values: ['single', 'multiple'] as const,
          group: 'behavior',
        },
        t.props?.selectionMode
      ),
      
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'default',
          editorType: 'select',
          values: ['default', 'separated', 'bordered', 'sunken', 'borderless', 'list'] as const,
          group: 'appearance',
        },
        t.props?.variant
      ),
      
      radius: createLocalizedProp(
        {
          name: 'radius',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'select',
          values: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const,
          group: 'appearance',
        },
        t.props?.radius
      ),
      
      radiusMode: createLocalizedProp(
        {
          name: 'radiusMode',
          type: 'enum',
          required: false,
          default: 'edges',
          editorType: 'segmented',
          values: ['edges', 'all', 'none'] as const,
          group: 'appearance',
        },
        t.props?.radiusMode
      ),
      
      gap: createLocalizedProp(
        {
          name: 'gap',
          type: 'enum',
          required: false,
          default: 'none',
          editorType: 'select',
          values: ['none', 'xs', 'sm', 'md', 'lg'] as const,
          group: 'layout',
        },
        t.props?.gap
      ),
      
      size: createLocalizedProp(
        {
          name: 'size',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['sm', 'md', 'lg'] as const,
          group: 'appearance',
        },
        t.props?.size
      ),
      
      showIndicator: createLocalizedProp(
        {
          name: 'showIndicator',
          type: 'boolean',
          required: false,
          default: true,
          editorType: 'toggle',
          group: 'appearance',
        },
        t.props?.showIndicator
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['card', 'vStack'],
    docsUrl: '/docs/components/accordion',
  };
};

export const accordionSchema = createAccordionSchema('sv');

// ===== ACCORDION ITEM SCHEMA =====
export const createAccordionItemSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(accordionItemTranslations, locale);
  
  return {
    $id: 'accordionItem',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'ChevronDown',
    tags: ['accordion', 'item', 'collapsible', 'disclosure'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      itemKey: '',
      title: '',
      content: '',
    },
    
    props: {
      itemKey: createLocalizedProp(
        {
          name: 'itemKey',
          type: 'string',
          required: true,
          default: '',
          editorType: 'text',
          group: 'content',
          cmsEnabled: false,
        },
        t.props?.itemKey
      ),
      
      title: createLocalizedProp(
        {
          name: 'title',
          type: 'string',
          required: true,
          default: '',
          editorType: 'text',
          group: 'content',
          cmsEnabled: true,
        },
        t.props?.title
      ),
      
      subtitle: createLocalizedProp(
        {
          name: 'subtitle',
          type: 'string',
          required: false,
          editorType: 'text',
          group: 'content',
          cmsEnabled: false,
        },
        t.props?.subtitle
      ),
      
      content: createLocalizedProp(
        {
          name: 'content',
          type: 'string',
          required: false,
          default: '',
          editorType: 'richtext',
          group: 'content',
          cmsEnabled: true,
        },
        t.props?.content
      ),
      
      disabled: createLocalizedProp(
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
          cmsEnabled: false,
        },
        t.props?.disabled
      ),
      
      disableIndicator: createLocalizedProp(
        {
          name: 'disableIndicator',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'appearance',
          cmsEnabled: false,
        },
        t.props?.disableIndicator
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['accordion'],
    docsUrl: '/docs/components/accordion-item',
  };
};

export const accordionItemSchema = createAccordionItemSchema('sv');
export default accordionSchema;
