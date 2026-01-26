import Banner from './Banner/Banner';
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
} from './Alert/Alert';
import Badge from './Badge/Badge';
import NumberDisplay from './NumberDisplay/NumberDisplay';
import Tag from './Tag/Tag';
import Toast from './Toast/Toast';
import Spinner from './Spinner/Spinner';
import { Skeleton, SkeletonCircle, SkeletonText } from './LoadingSkeleton/LoadingSkeleton';
import Progress from './Progress/Progress';
import PageLoading from './PageLoading/PageLoading';
import InlineLoading from './InlineLoading/InlineLoading';

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