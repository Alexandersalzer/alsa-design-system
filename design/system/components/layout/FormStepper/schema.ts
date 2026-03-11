/**
 * FormStepper + FormStep Component Schemas
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

// ── FormStepper ─────────────────────────────────────────────

export const createFormStepperSchema = (_locale: SupportedLocale = 'sv'): ComponentSchema => {
  return {
    $id: 'formStepper',
    displayName: 'Form Stepper',
    category: 'layout',
    description: 'Multi-step form layout with progress indicator. Wrap FormStep children inside it.',
    icon: 'ClipboardDocumentList',
    tags: ['form', 'stepper', 'multi-step', 'layout', 'wizard'],
    version: '1.0.0',
    cmsEnabled: false,

    defaultProps: {
      stepLabels: ['Step 1', 'Step 2', 'Step 3'],
      nextLabel: 'Nästa',
      backLabel: 'Tillbaka',
      submitLabel: 'Skicka',
      variant: 'default',
      maxWidth: 'lg',
    },

    props: {
      stepLabels: {
        name: 'stepLabels',
        displayName: 'Step labels',
        type: 'array',
        required: false,
        editorType: 'list',
        group: 'content',
        items: { name: 'label', displayName: 'Label', type: 'string' },
      },
      nextLabel: {
        name: 'nextLabel',
        displayName: 'Next button label',
        type: 'string',
        required: false,
        default: 'Nästa',
        editorType: 'text',
        group: 'content',
      },
      backLabel: {
        name: 'backLabel',
        displayName: 'Back button label',
        type: 'string',
        required: false,
        default: 'Tillbaka',
        editorType: 'text',
        group: 'content',
      },
      submitLabel: {
        name: 'submitLabel',
        displayName: 'Submit button label',
        type: 'string',
        required: false,
        default: 'Skicka',
        editorType: 'text',
        group: 'content',
      },
      variant: {
        name: 'variant',
        displayName: 'Variant',
        type: 'string',
        required: false,
        default: 'default',
        editorType: 'text',
        group: 'style',
      },
      maxWidth: {
        name: 'maxWidth',
        displayName: 'Max width',
        type: 'string',
        required: false,
        default: 'lg',
        editorType: 'text',
        group: 'style',
      },
    },

    validation: [],
    examples: [],
    related: ['formStep', 'accordion'],
    docsUrl: '/docs/components/form-stepper',
  };
};

// ── FormStep ─────────────────────────────────────────────────

export const createFormStepSchema = (_locale: SupportedLocale = 'sv'): ComponentSchema => {
  return {
    $id: 'formStep',
    displayName: 'Form Step',
    category: 'layout',
    description: 'A single step panel inside a FormStepper. Shown/hidden based on the active step.',
    icon: 'DocumentText',
    tags: ['form', 'step', 'panel', 'layout'],
    version: '1.0.0',
    cmsEnabled: true,

    defaultProps: {
      stepKey: '',
      label: '',
    },

    props: {
      stepKey: {
        name: 'stepKey',
        displayName: 'Step key',
        type: 'string',
        required: true,
        editorType: 'text',
        group: 'content',
        cmsEnabled: false,
      },
      label: {
        name: 'label',
        displayName: 'Label',
        type: 'string',
        required: false,
        default: '',
        editorType: 'text',
        group: 'content',
      },
    },

    validation: [],
    examples: [],
    related: ['formStepper'],
    docsUrl: '/docs/components/form-step',
  };
};

export const formStepperSchema = createFormStepperSchema('sv');
export const formStepSchema = createFormStepSchema('sv');
