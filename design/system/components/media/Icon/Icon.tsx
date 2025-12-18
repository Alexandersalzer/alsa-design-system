// ===============================================
// design/system/components/primitives/Icon/Icon.tsx
// MODERN VERSION - Clean API, no deprecated patterns
// ===============================================


import React, { forwardRef, ReactElement, cloneElement } from 'react';
import { cn } from '../../../utils/cn';

// ===== TYPE DEFINITIONS =====
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type IconColor = 
  | 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse'
  | 'heading' | 'body' | 'accent' | 'success' | 'warning' | 'error'
  | 'muted' | 'subtle' | 'nav-item' | 'nav-item-hover' | 'nav-item-selected'
  | 'user-menu' | 'search' | 'empty-state' | 'card-primary'
  | 'button-primary' | 'button-secondary' | 'button-accent' | 'button-ghost' | 'button-destructive' | 'button-disabled';

export type IconWeight = 'thin' | 'light' | 'regular' | 'medium' | 'bold';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color' | 'size'> {
  children: ReactElement;
  size?: IconSize;
  color?: IconColor;
  weight?: IconWeight;
  className?: string;
  'aria-label'?: string;
}

// ===== SIZE, COLOR, WEIGHT MAPPINGS =====
const sizeMap: Record<IconSize, string> = {
  'xs': 'icon-xs', 'sm': 'icon-sm', 'md': 'icon-md',
  'lg': 'icon-lg', 'xl': 'icon-xl', '2xl': 'icon-2xl'
};

const colorMap: Record<IconColor, string> = {
  'primary': 'icon-primary', 'secondary': 'icon-secondary', 'tertiary': 'icon-tertiary',
  'disabled': 'icon-disabled', 'inverse': 'icon-inverse', 'heading': 'icon-heading',
  'body': 'icon-body', 'accent': 'icon-accent', 'success': 'icon-success',
  'warning': 'icon-warning', 'error': 'icon-error', 'muted': 'icon-muted',
  'subtle': 'icon-subtle', 'nav-item': 'icon-nav-item', 'nav-item-hover': 'icon-nav-item-hover',
  'nav-item-selected': 'icon-nav-item-selected', 'user-menu': 'icon-user-menu',
  'search': 'icon-search', 'empty-state': 'icon-empty-state', 'card-primary': 'icon-card-primary',
  'button-primary': 'icon-button-primary', 'button-secondary': 'icon-button-secondary',
  'button-accent': 'icon-button-accent', 'button-ghost': 'icon-button-ghost',
  'button-destructive': 'icon-button-destructive', 'button-disabled': 'icon-button-disabled'
};

const weightMap: Record<IconWeight, string> = {
  'thin': 'icon-weight-thin', 'light': 'icon-weight-light', 'regular': 'icon-weight-regular',
  'medium': 'icon-weight-medium', 'bold': 'icon-weight-bold'
};

// ===== MAIN ICON COMPONENT =====
export const Icon = forwardRef<SVGSVGElement, IconProps>(({
  children, size = 'md', color = 'primary', weight = 'regular', className, 'aria-label': ariaLabel, ...props
}, ref) => {
  const iconClasses = cn('icon', sizeMap[size], colorMap[color], weightMap[weight], className);

  const { ref: _, ...cleanProps } = props as any;

  const iconElement = cloneElement(children, {
    ref, className: iconClasses, 'aria-label': ariaLabel,
    'aria-hidden': ariaLabel ? undefined : 'true', focusable: 'false',
    role: ariaLabel ? 'img' : 'presentation',
    style: { ...cleanProps.style }, ...cleanProps
  });

  return iconElement;
});

Icon.displayName = 'Icon';

// ===== HEROICONS IMPORTS =====
import { 
  SunIcon, MoonIcon, HomeIcon, Bars3Icon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowDownIcon,
  ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon,
  DocumentIcon, DocumentTextIcon, DocumentDuplicateIcon, DocumentArrowDownIcon, DocumentArrowUpIcon,
  DocumentPlusIcon, DocumentMinusIcon, DocumentCheckIcon, DocumentMagnifyingGlassIcon,
  FolderIcon, FolderOpenIcon, FolderPlusIcon, ArchiveBoxIcon, InboxIcon, PaperClipIcon,
  NewspaperIcon, BookOpenIcon, ClipboardDocumentIcon, ClipboardDocumentListIcon, ClipboardIcon,
  PencilIcon, PencilSquareIcon, PlusIcon, MinusIcon, CheckIcon, TrashIcon, ShareIcon,
  EllipsisHorizontalIcon, EllipsisVerticalIcon, PlayIcon, PauseIcon, StopIcon,
  ArrowTopRightOnSquareIcon, ArrowPathIcon, MagnifyingGlassIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon,
  SwatchIcon, PaintBrushIcon, ScissorsIcon, RectangleGroupIcon, Square2StackIcon, Square3Stack3DIcon, 
  Squares2X2Icon, SquaresPlusIcon, ViewColumnsIcon, ViewfinderCircleIcon,
  Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3CenterLeftIcon, Bars4Icon,
  ArrowsPointingInIcon, ArrowsPointingOutIcon, ArrowsRightLeftIcon, ArrowsUpDownIcon,
  RectangleStackIcon, CursorArrowRaysIcon, LanguageIcon, ChatBubbleBottomCenterTextIcon, ListBulletIcon, TableCellsIcon, CodeBracketIcon,
  PhotoIcon, CameraIcon, VideoCameraIcon, FilmIcon, MusicalNoteIcon, MicrophoneIcon,
  SpeakerWaveIcon, SpeakerXMarkIcon, PlayCircleIcon, PauseCircleIcon, StopCircleIcon,
  ForwardIcon, BackwardIcon, UserIcon, UserCircleIcon, UserGroupIcon, UserPlusIcon, UserMinusIcon, UsersIcon,
  FaceSmileIcon, FaceFrownIcon, IdentificationIcon, AcademicCapIcon,
  ChatBubbleLeftRightIcon, ChatBubbleOvalLeftIcon, EnvelopeIcon, EnvelopeOpenIcon, PhoneIcon,
  BellIcon, BellAlertIcon, BellSlashIcon, HeartIcon, HandThumbUpIcon, HandThumbDownIcon, LinkIcon,
  CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon,
  ExclamationCircleIcon, QuestionMarkCircleIcon, LightBulbIcon, FireIcon, SparklesIcon,
  ShieldCheckIcon, ShieldExclamationIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, LockOpenIcon,
  ClockIcon, CalendarIcon, CalendarDaysIcon, ChartBarIcon, ChartPieIcon, PresentationChartBarIcon, PresentationChartLineIcon,
  QueueListIcon, FunnelIcon, AdjustmentsHorizontalIcon, AdjustmentsVerticalIcon,
  BarsArrowUpIcon, BarsArrowDownIcon, CurrencyDollarIcon, CurrencyEuroIcon, CurrencyPoundIcon, CurrencyYenIcon,
  CreditCardIcon, BanknotesIcon, ShoppingCartIcon, ShoppingBagIcon, BuildingStorefrontIcon,
  ReceiptPercentIcon, ReceiptRefundIcon, GiftIcon, TagIcon, TicketIcon,
  ComputerDesktopIcon, DevicePhoneMobileIcon, DeviceTabletIcon, TvIcon, WindowIcon,
  WifiIcon, SignalIcon, ServerIcon, CloudIcon, CommandLineIcon,
  CpuChipIcon, BoltIcon, PowerIcon, WrenchScrewdriverIcon, Cog6ToothIcon, Cog8ToothIcon,
  MapPinIcon, MapIcon, GlobeAltIcon, GlobeAmericasIcon, GlobeAsiaAustraliaIcon, GlobeEuropeAfricaIcon,
  BuildingOfficeIcon, BuildingOffice2Icon, HomeModernIcon, BuildingLibraryIcon, TruckIcon, RocketLaunchIcon,
  StarIcon, FlagIcon, BookmarkIcon, MegaphoneIcon, CubeIcon, KeyIcon, PuzzlePieceIcon, BeakerIcon,
  AtSymbolIcon, HashtagIcon, QrCodeIcon, PrinterIcon, ScaleIcon, CalculatorIcon,
  NoSymbolIcon, PlusCircleIcon, MinusCircleIcon, HandRaisedIcon,
} from '@heroicons/react/24/outline';
