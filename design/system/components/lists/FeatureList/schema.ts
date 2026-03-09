import { ComponentSchema } from '../../../core/schemas/component.types';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createFeatureListSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  return {
    $id: 'featureList',
    displayName: locale === 'en' ? 'Feature List' : 'Punktlista',
    category: 'lists',
    description: locale === 'en'
      ? 'Bullet list with customizable icons (check, checkCircle, dot, bullet)'
      : 'Punktlista med valbara ikoner (check, checkCircle, punkt, cirkel)',
    icon: 'List',
    tags: ['list', 'features', 'bullet', 'check', 'items'],
    version: '1.0.0',
    cmsEnabled: true,

    defaultProps: {
      items: [
        locale === 'en' ? 'First item' : 'Första punkten',
        locale === 'en' ? 'Second item' : 'Andra punkten',
        locale === 'en' ? 'Third item' : 'Tredje punkten',
      ],
      icon: 'check',
      color: 'accent',
      size: 'md',
      spacing: 'sm',
    },

    props: {
      items: {
        name: 'items',
        displayName: locale === 'en' ? 'Items' : 'Punkter',
        type: 'array',
        required: false,
        editorType: 'list',
        cmsEnabled: true,
        group: 'content',
      },
      icon: {
        name: 'icon',
        displayName: locale === 'en' ? 'Icon style' : 'Ikonstil',
        type: 'enum',
        required: false,
        default: 'check',
        editorType: 'select',
        values: ['check', 'checkCircle', 'dot', 'bullet'] as const,
        group: 'appearance',
      },
      color: {
        name: 'color',
        displayName: locale === 'en' ? 'Icon color' : 'Ikonfärg',
        type: 'enum',
        required: false,
        default: 'accent',
        editorType: 'select',
        values: ['default', 'accent', 'success', 'muted'] as const,
        group: 'appearance',
      },
      size: {
        name: 'size',
        displayName: locale === 'en' ? 'Size' : 'Storlek',
        type: 'enum',
        required: false,
        default: 'md',
        editorType: 'segmented',
        values: ['sm', 'md', 'lg'] as const,
        group: 'appearance',
      },
      spacing: {
        name: 'spacing',
        displayName: locale === 'en' ? 'Spacing' : 'Avstånd',
        type: 'enum',
        required: false,
        default: 'sm',
        editorType: 'segmented',
        values: ['xs', 'sm', 'md'] as const,
        group: 'appearance',
      },
    },

    validation: [],
    examples: [],
    related: ['list', 'body'],
    docsUrl: '/docs/components/feature-list',
  };
};

export const featureListSchema = createFeatureListSchema('sv');
export default featureListSchema;
