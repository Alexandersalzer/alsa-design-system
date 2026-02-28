/**
 * ImageBackground Component Schema
 * 
 * Defines the complete schema for the ImageBackground component including:
 * - All available props with types and validation
 * - Default values
 * - CMS editor configuration
 */

import { ComponentSchema } from '../../../core/schemas/component.types';

/**
 * ImageBackground schema for section backgrounds
 */
export const imageBackgroundSchema: ComponentSchema = {
  $id: 'imageBackground',
  displayName: 'Image Background',
  category: 'media',
  description: 'Static image background for sections and pages with advanced styling options',
  icon: 'Image',
  tags: ['background', 'image', 'visual'],
  version: '1.0.0',
  cmsEnabled: true,
  
  defaultProps: {
    src: '',
    size: 'cover',
    position: 'center',
    opacity: 1,
    tint: 'none',
    fadeEdge: 'none',
    fadeStrength: 0.15,
  },
  
  props: {
    src: {
      name: 'src',
      type: 'string',
      displayName: 'Image URL',
      description: 'URL to the background image',
      required: true,
      editorType: 'url',
      group: 'content',
      cmsEnabled: true,
    },
    
    size: {
      name: 'size',
      type: 'enum',
      displayName: 'Size',
      description: 'How the image should fit in the container',
      required: false,
      default: 'cover',
      editorType: 'segmented',
      values: ['cover', 'contain'] as const,
      valueLabels: {
        cover: 'Cover (fill container, may crop)',
        contain: 'Contain (fit entire image, may letterbox)',
      },
      group: 'layout',
      cmsEnabled: true,
    },
    
    position: {
      name: 'position',
      type: 'enum',
      displayName: 'Position',
      description: 'Position of the image within the container',
      required: false,
      default: 'center',
      editorType: 'select',
      values: ['top', 'center', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'] as const,
      valueLabels: {
        top: 'Top',
        center: 'Center',
        bottom: 'Bottom',
        left: 'Left',
        right: 'Right',
        'top left': 'Top Left',
        'top right': 'Top Right',
        'bottom left': 'Bottom Left',
        'bottom right': 'Bottom Right',
      },
      group: 'layout',
      cmsEnabled: true,
    },
    
    opacity: {
      name: 'opacity',
      type: 'number',
      displayName: 'Opacity',
      description: 'Image opacity (0 = transparent, 1 = fully opaque)',
      required: false,
      default: 1,
      editorType: 'slider',
      min: 0,
      max: 1,
      step: 0.05,
      group: 'appearance',
      cmsEnabled: true,
    },
    
    tint: {
      name: 'tint',
      type: 'enum',
      displayName: 'Accent Tint',
      description: 'Apply accent color tint to the image (requires image with white background)',
      required: false,
      default: 'none',
      editorType: 'segmented',
      values: ['none', 'accent'] as const,
      valueLabels: {
        none: 'No tint',
        accent: 'Accent color',
      },
      group: 'appearance',
      cmsEnabled: true,
    },
    
    tintStrength: {
      name: 'tintStrength',
      type: 'number',
      displayName: 'Tint Strength',
      description: 'Strength of the accent tint effect (0-2)',
      required: false,
      default: 1.2,
      editorType: 'slider',
      min: 0,
      max: 2,
      step: 0.1,
      group: 'appearance',
      cmsEnabled: true,
      visibleWhen: {
        property: 'tint',
        operator: 'equals',
        value: 'accent',
      },
    },
    
    fadeEdge: {
      name: 'fadeEdge',
      type: 'enum',
      displayName: 'Fade Edge',
      description: 'Add a gradient fade to an edge of the image',
      required: false,
      default: 'none',
      editorType: 'select',
      values: ['none', 'top', 'bottom', 'left', 'right'] as const,
      valueLabels: {
        none: 'No fade',
        top: 'Top',
        bottom: 'Bottom',
        left: 'Left',
        right: 'Right',
      },
      group: 'effects',
      cmsEnabled: true,
    },
    
    fadeStrength: {
      name: 'fadeStrength',
      type: 'number',
      displayName: 'Fade Strength',
      description: 'Strength of the fade effect (0-1)',
      required: false,
      default: 0.15,
      editorType: 'slider',
      min: 0,
      max: 1,
      step: 0.05,
      group: 'effects',
      cmsEnabled: true,
      visibleWhen: {
        property: 'fadeEdge',
        operator: 'notEquals',
        value: 'none',
      },
    },
    
    filter: {
      name: 'filter',
      type: 'string',
      displayName: 'CSS Filter',
      description: 'CSS filter effects (e.g., "blur(6px)", "brightness(0.8)")',
      required: false,
      editorType: 'text',
      group: 'effects',
      cmsEnabled: false, // Advanced feature
    },
  },
  
  validation: [
    {
      id: 'src-required',
      message: 'Image URL is required',
      validator: (value, allProps) => {
        return !!allProps.src && allProps.src.trim().length > 0;
      },
      severity: 'error',
    },
    {
      id: 'opacity-range',
      message: 'Opacity must be between 0 and 1',
      validator: (value, allProps) => {
        const opacity = allProps.opacity ?? 1;
        return opacity >= 0 && opacity <= 1;
      },
      severity: 'error',
    },
    {
      id: 'fade-strength-range',
      message: 'Fade strength must be between 0 and 1',
      validator: (value, allProps) => {
        const fadeStrength = allProps.fadeStrength ?? 0.15;
        return fadeStrength >= 0 && fadeStrength <= 1;
      },
      severity: 'warning',
    },
  ],
  
  examples: [
    {
      name: 'Cover Background',
      description: 'Standard full-cover background image',
      category: 'common',
      data: {
        type: 'imageBackground',
        props: {
          src: 'https://example.com/hero-bg.jpg',
          size: 'cover',
          position: 'center',
          opacity: 1,
        },
      },
    },
    {
      name: 'Subtle Background',
      description: 'Low opacity background for text readability',
      category: 'common',
      data: {
        type: 'imageBackground',
        props: {
          src: 'https://example.com/hero-bg.jpg',
          size: 'cover',
          position: 'center',
          opacity: 0.3,
        },
      },
    },
    {
      name: 'Bottom Fade',
      description: 'Image with bottom gradient fade',
      category: 'effects',
      data: {
        type: 'imageBackground',
        props: {
          src: 'https://example.com/hero-bg.jpg',
          size: 'cover',
          position: 'center',
          opacity: 1,
          fadeEdge: 'bottom',
          fadeStrength: 0.15,
        },
      },
    },
    {
      name: 'Accent Tint',
      description: 'Image with accent color tint effect',
      category: 'effects',
      data: {
        type: 'imageBackground',
        props: {
          src: 'https://example.com/pattern.svg',
          size: 'cover',
          position: 'center',
          opacity: 1,
          tint: 'accent',
          tintStrength: 1.2,
        },
      },
    },
  ],
  
  related: ['section'],
  docsUrl: '/docs/components/image-background',
};

export default imageBackgroundSchema;
