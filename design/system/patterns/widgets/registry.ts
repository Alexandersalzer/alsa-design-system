import { TrustpilotReviewCollector } from './TrustpilotReviewCollector/TrustpilotReviewCollector';
import { CalendlyModal } from './CalendlyModal/CalendlyModal';
import { calendlyComponents } from './calendly/registry';

export const widgetsRegistry = {
  trustpilotReviewCollector: TrustpilotReviewCollector,
  calendlyModal: CalendlyModal,
  ...calendlyComponents,
};
