/**
 * BookingForm Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createBookingFormSchema = (_locale: SupportedLocale = 'sv'): ComponentSchema => {
  return {
    $id: 'bookingForm',
    displayName: 'Booking Form',
    category: 'forms',
    description: 'Multi-step booking form with package selection, date/time picking, and personal details.',
    icon: 'ClipboardDocumentList',
    tags: ['form', 'booking', 'contact', 'multi-step'],
    version: '1.0.0',
    cmsEnabled: true,

    defaultProps: {
      packageTitle: 'Hur många knivar vill du slipa?',
      packageCaption: '120 kr per kniv · Minimum 4 knivar per bokning',
      packages: [
        { id: 'pkg_4', label: '4 knivar', price: '480 kr' },
        { id: 'pkg_5_7', label: '5–7 knivar', price: '600–840 kr' },
        { id: 'pkg_8plus', label: '8+ knivar', price: '960 kr+', description: '120 kr per kniv' },
      ],
      dateTitle: 'Välj datum',
      timeTitle: 'Välj tid',
      quickTimes: [
        { label: '08:00', value: '08:00' },
        { label: '10:00', value: '10:00' },
        { label: '12:00', value: '12:00' },
        { label: '14:00', value: '14:00' },
      ],
      detailsTitle: 'Dina uppgifter',
      submitLabel: 'Betala på plats',
      stepLabels: ['Paket', 'Datum & tid', 'Uppgifter'],
    },

    props: {
      packageTitle: {
        name: 'packageTitle',
        displayName: 'Package title',
        type: 'string',
        required: false,
        default: 'Hur många knivar vill du slipa?',
        editorType: 'text',
        group: 'content',
      },
      packageCaption: {
        name: 'packageCaption',
        displayName: 'Package caption',
        type: 'string',
        required: false,
        default: '120 kr per kniv · Minimum 4 knivar per bokning',
        editorType: 'text',
        group: 'content',
      },
      packages: {
        name: 'packages',
        displayName: 'Packages',
        type: 'array',
        required: false,
        editorType: 'repeater',
        group: 'content',
        items: { name: 'package', displayName: 'Package', type: 'string' },
      },
      dateTitle: {
        name: 'dateTitle',
        displayName: 'Date title',
        type: 'string',
        required: false,
        default: 'Välj datum',
        editorType: 'text',
        group: 'content',
      },
      timeTitle: {
        name: 'timeTitle',
        displayName: 'Time title',
        type: 'string',
        required: false,
        default: 'Välj tid',
        editorType: 'text',
        group: 'content',
      },
      quickTimes: {
        name: 'quickTimes',
        displayName: 'Quick time options',
        type: 'array',
        required: false,
        editorType: 'repeater',
        group: 'content',
        items: { name: 'time', displayName: 'Time', type: 'string' },
      },
      detailsTitle: {
        name: 'detailsTitle',
        displayName: 'Details step title',
        type: 'string',
        required: false,
        default: 'Dina uppgifter',
        editorType: 'text',
        group: 'content',
      },
      submitLabel: {
        name: 'submitLabel',
        displayName: 'Submit button label',
        type: 'string',
        required: false,
        default: 'Betala på plats',
        editorType: 'text',
        group: 'content',
      },
      stepLabels: {
        name: 'stepLabels',
        displayName: 'Step labels',
        type: 'array',
        required: false,
        editorType: 'list',
        group: 'content',
        items: { name: 'label', displayName: 'Label', type: 'string' },
      },
    },

    validation: [],
    examples: [],
    related: ['input', 'datePicker', 'timeInput', 'selectionCard'],
    docsUrl: '/docs/components/booking-form',
  };
};

export const bookingFormSchema = createBookingFormSchema('sv');
export default bookingFormSchema;
