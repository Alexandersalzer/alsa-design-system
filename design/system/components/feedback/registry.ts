import { Alert } from './Alert/Alert';
import { Badge } from './Badge/Badge';
import { Banner } from './Banner/Banner';
import { Tag } from './Tag/Tag';
import { Toast } from './Toast/Toast';
import { Spinner } from './Spinner/Spinner';
import { Progress } from './Progress/Progress';
import { InlineLoading } from './InlineLoading/InlineLoading';
import { PageLoading } from './PageLoading/PageLoading';
import { LoadingSkeleton } from './LoadingSkeleton/LoadingSkeleton';
import { NumberDisplay } from './NumberDisplay/NumberDisplay';

export const feedbackComponents: Record<string, React.ComponentType<any>> = {
  alert: Alert,
  badge: Badge,
  banner: Banner,
  tag: Tag,
  toast: Toast,
  spinner: Spinner,
  progress: Progress,
  inlineLoading: InlineLoading,
  pageLoading: PageLoading,
  loadingSkeleton: LoadingSkeleton,
  numberDisplay: NumberDisplay,
};