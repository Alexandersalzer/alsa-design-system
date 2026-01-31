import { Badge } from './Badge/Badge';
import { NumberBadge } from './Badge/NumberBadge';
import { Banner } from './Banner/Banner';
import { Tag } from './Tag/Tag';
import { Toast } from './Toast/Toast';
import { Spinner } from './Spinner/Spinner';
import { Progress } from './Progress/Progress';
import { InlineLoading } from './InlineLoading/InlineLoading';
import { PageLoading } from './PageLoading/PageLoading';
import { Skeleton } from './LoadingSkeleton/LoadingSkeleton';
import { NumberDisplay } from './NumberDisplay/NumberDisplay';
import { Stars } from './Stars/Stars';

export const feedbackComponents: Record<string, React.ComponentType<any>> = {
  badge: Badge,
  numberBadge: NumberBadge,
  banner: Banner,
  tag: Tag,
  toast: Toast,
  spinner: Spinner,
  progress: Progress,
  inlineLoading: InlineLoading,
  pageLoading: PageLoading,
  skeleton: Skeleton,
  numberDisplay: NumberDisplay,
  stars: Stars,
};