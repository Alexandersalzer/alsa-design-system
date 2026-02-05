import { CalendlyInline } from './CalendlyInline';
import { CalendlyModal } from './CalendlyModal';

export const calendlyComponents = {
  'calendly-inline': CalendlyInline,
  'calendly-modal': CalendlyModal,
};

export { CalendlyInline } from './CalendlyInline';
export type { CalendlyInlineProps } from './CalendlyInline';

export { CalendlyModal, buildCalendlyUrl, openCalendlyPopup, closeCalendlyPopup } from './CalendlyModal';
export type { CalendlyModalProps } from './CalendlyModal';
