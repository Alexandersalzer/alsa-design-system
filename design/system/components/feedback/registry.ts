import { Banner } from './Banner';
import {
  AlertRoot,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertCloseButton,
  AlertClosed,
  ErrorAlert,
  SuccessAlert,
  WarningAlert,
  InfoAlert,
} from './Alert';
import { Badge } from './Badge';
import { NumberDisplay } from './NumberDisplay';
import { Tag } from './Tag';
import { Toast } from './Toast';
import { Spinner } from './Spinner';
import { Skeleton, SkeletonCircle, SkeletonText } from './LoadingSkeleton';
import { Progress } from './Progress';
import { PageLoading } from './PageLoading';
import { InlineLoading } from './InlineLoading';

export const feedbackComponents: Record<string, React.ComponentType<any>> = {
  banner: Banner,
  alertRoot: AlertRoot,
  alertIndicator: AlertIndicator,
  alertContent: AlertContent,
  alertTitle: AlertTitle,
  alertDescription: AlertDescription,
  alertCloseButton: AlertCloseButton,
  alertClosed: AlertClosed,
  errorAlert: ErrorAlert,
  successAlert: SuccessAlert,
  warningAlert: WarningAlert,
  infoAlert: InfoAlert,
  badge: Badge,
  numberDisplay: NumberDisplay,
  tag: Tag,
  toast: Toast,
  spinner: Spinner,
  skeleton: Skeleton,
  skeletonCircle: SkeletonCircle,
  skeletonText: SkeletonText,
  progress: Progress,
  pageLoading: PageLoading,
  inlineLoading: InlineLoading,
};