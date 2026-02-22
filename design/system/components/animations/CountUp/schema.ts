/**
 * CountUp Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { countUpTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createCountUpSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(countUpTranslations, locale);
  
  return {
    $id: 'countup',
    displayName: t.displayName,
    category: 'typography',
    description: t.description,
    icon: 'ChartBar',
    tags: ['animation', 'counter', 'stats', 'numbers'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      start: 0,
      end: 100,
      suffix: '',
      duration: 2000,
      enableScrollTrigger: true,
      triggerOffset: 100,
      variant: 'display-lg',
      weight: 'bold',
      color: 'primary',
    },
    
    props: {
      start: createLocalizedProp(
        {
          name: 'start',
          type: 'number',
          required: false,
          default: 0,
          editorType: 'number',
          cmsEnabled: false,
          group: 'content',
        },
        t.props?.start
      ),

      end: createLocalizedProp(
        {
          name: 'end',
          type: 'number',
          required: true,
          editorType: 'number',
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.end
      ),

      suffix: createLocalizedProp(
        {
          name: 'suffix',
          type: 'enum',
          required: false,
          default: '',
          editorType: 'segmented',
          values: ['', '+', 'k+', '%', 'kr'] as const,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.suffix
      ),

      duration: createLocalizedProp(
        {
          name: 'duration',
          type: 'number',
          required: false,
          default: 2000,
          editorType: 'number',
          cmsEnabled: false,
          group: 'behavior',
        },
        t.props?.duration
      ),

      enableScrollTrigger: createLocalizedProp(
        {
          name: 'enableScrollTrigger',
          type: 'boolean',
          required: false,
          default: true,
          editorType: 'toggle',
          cmsEnabled: false,
          group: 'behavior',
        },
        t.props?.enableScrollTrigger
      ),

      triggerOffset: createLocalizedProp(
        {
          name: 'triggerOffset',
          type: 'number',
          required: false,
          default: 100,
          editorType: 'number',
          cmsEnabled: false,
          group: 'behavior',
          visibleWhen: {
            property: 'enableScrollTrigger',
            operator: 'equals',
            value: true,
          },
        },
        t.props?.triggerOffset
      ),

      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'display-lg',
          editorType: 'select',
          values: ['display-xl', 'display-lg', 'display-md', 'display-sm', 'h1', 'h2', 'h3', 'body-xl', 'body-lg'] as const,
          group: 'appearance',
        },
        t.props?.variant
      ),

      size: createLocalizedProp(
        {
          name: 'size',
          type: 'enum',
          required: false,
          default: 'lg',
          editorType: 'segmented',
          values: ['xl', 'lg', 'md', 'sm'] as const,
          group: 'appearance',
        },
        t.props?.size
      ),

      weight: createLocalizedProp(
        {
          name: 'weight',
          type: 'enum',
          required: false,
          default: 'bold',
          editorType: 'select',
          values: ['light', 'regular', 'medium', 'semibold', 'bold', 'extrabold', 'black'] as const,
          group: 'appearance',
        },
        t.props?.weight
      ),

      color: createLocalizedProp(
        {
          name: 'color',
          type: 'enum',
          required: false,
          default: 'primary',
          editorType: 'select',
          values: ['primary', 'secondary', 'heading', 'body', 'accent', 'brand', 'success', 'warning', 'error'] as const,
          group: 'appearance',
        },
        t.props?.color
      ),

      align: createLocalizedProp(
        {
          name: 'align',
          type: 'enum',
          required: false,
          editorType: 'segmented',
          values: ['left', 'center', 'right'] as const,
          group: 'appearance',
        },
        t.props?.align
      ),
    },
    
    validation: [
      {
        id: 'countup-end-required',
        message: 'End value is required',
        validator: (value: any) => typeof value.end === 'number',
      },
      {
        id: 'countup-duration-positive',
        message: 'Duration must be positive',
        validator: (value: any) => !value.duration || value.duration > 0,
      },
    ],
    examples: [],
    
    related: ['display', 'body', 'stats'],
    docsUrl: '/docs/components/countup',
  };
};

export const countUpSchema = createCountUpSchema('sv');
export default countUpSchema;
