import { CalInline } from './CalInline';
import { CalModal } from './CalModal';

export const calComponents = {
  'cal-inline': CalInline,
  'cal-modal': CalModal,
};

export { CalInline } from './CalInline';
export type { CalInlineProps } from './CalInline';

export { CalModal, buildCalUrl, openCalPopup, closeCalPopup } from './CalModal';
export type { CalModalProps } from './CalModal';
