// src/design-system/components/primitives/Icon/index.ts
// FIXED - Only exports what actually exists in Icon.tsx

import React from 'react';

// ===== EXPORT WHAT EXISTS IN YOUR Icon.tsx =====
export {
  Icon, 
  type IconSize,
  type IconColor,
  type IconWeight,
  type IconProps,
  type ButtonVariant
} from './Icon';

// ===== EXPORT ALL HEROICONS =====
export {
  // Theme
  SunIcon, MoonIcon,
  
  // Navigation & Core
  HomeIcon, Bars3Icon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowDownIcon,
  ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon,
  
  // Actions & Controls
  PlusIcon, PencilIcon, TrashIcon, CheckIcon, ShareIcon,
  EllipsisHorizontalIcon, EllipsisVerticalIcon, EyeIcon, EyeSlashIcon,
  ArrowPathIcon, ArrowTopRightOnSquareIcon, MagnifyingGlassIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon,
  
  // Documents & Content
  DocumentIcon, DocumentTextIcon, DocumentDuplicateIcon,
  DocumentArrowDownIcon, DocumentArrowUpIcon, DocumentPlusIcon, DocumentMinusIcon, 
  DocumentCheckIcon, DocumentMagnifyingGlassIcon,
  FolderIcon, FolderOpenIcon, FolderPlusIcon, ArchiveBoxIcon, InboxIcon, PaperClipIcon,
  NewspaperIcon, BookOpenIcon, ClipboardDocumentIcon, ClipboardDocumentListIcon, ClipboardIcon,
  
  // Design & Editing Tools
  SwatchIcon, PaintBrushIcon, ScissorsIcon, RectangleGroupIcon, Square2StackIcon, Square3Stack3DIcon,
  Squares2X2Icon, SquaresPlusIcon, ViewColumnsIcon, ViewfinderCircleIcon,
  
  // Layout & Positioning
  Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3CenterLeftIcon, Bars4Icon,
  ArrowsPointingInIcon, ArrowsPointingOutIcon, ArrowsRightLeftIcon, ArrowsUpDownIcon,
  RectangleStackIcon, CursorArrowRaysIcon,
  
  // Text & Typography
  LanguageIcon, ChatBubbleBottomCenterTextIcon, ListBulletIcon, TableCellsIcon, CodeBracketIcon,
  
  // Media & Content
  PhotoIcon, CameraIcon, VideoCameraIcon, FilmIcon, MusicalNoteIcon, MicrophoneIcon,
  SpeakerWaveIcon, SpeakerXMarkIcon, PlayCircleIcon, PauseCircleIcon, StopCircleIcon,
  ForwardIcon, BackwardIcon, PlayIcon, PauseIcon, StopIcon,
  
  // Users & People
  UserIcon, UserCircleIcon, UserGroupIcon, UserPlusIcon, UserMinusIcon, UsersIcon,
  FaceSmileIcon, FaceFrownIcon, IdentificationIcon, AcademicCapIcon,
  
  // Communication & Social
  ChatBubbleLeftRightIcon, ChatBubbleOvalLeftIcon, EnvelopeIcon, EnvelopeOpenIcon, PhoneIcon,
  BellIcon, BellAlertIcon, BellSlashIcon, HeartIcon, HandThumbUpIcon, HandThumbDownIcon, LinkIcon,
  
  // Status & Feedback
  CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon,
  ExclamationCircleIcon, QuestionMarkCircleIcon, LightBulbIcon, FireIcon, SparklesIcon,
  ShieldCheckIcon, ShieldExclamationIcon, LockClosedIcon, LockOpenIcon,
  
  // Time & Calendar
  ClockIcon, CalendarIcon, CalendarDaysIcon,
  
  // Data & Analytics
  ChartBarIcon, ChartPieIcon, PresentationChartBarIcon, PresentationChartLineIcon,
  QueueListIcon, FunnelIcon, AdjustmentsHorizontalIcon, AdjustmentsVerticalIcon,
  BarsArrowUpIcon, BarsArrowDownIcon,
  
  // E-commerce & Business
  CurrencyDollarIcon, CurrencyEuroIcon, CurrencyPoundIcon, CurrencyYenIcon,
  CreditCardIcon, BanknotesIcon, ShoppingCartIcon, ShoppingBagIcon, BuildingStorefrontIcon,
  ReceiptPercentIcon, ReceiptRefundIcon, GiftIcon, TagIcon, TicketIcon,
  
  // Tech & System
  ComputerDesktopIcon, DevicePhoneMobileIcon, DeviceTabletIcon, TvIcon, WindowIcon,
  WifiIcon, SignalIcon, ServerIcon, CloudIcon, CommandLineIcon,
  CpuChipIcon, BoltIcon, PowerIcon, WrenchScrewdriverIcon, Cog6ToothIcon, Cog8ToothIcon,
  
  // Location & Maps
  MapPinIcon, MapIcon, GlobeAltIcon, GlobeAmericasIcon, GlobeAsiaAustraliaIcon, GlobeEuropeAfricaIcon,
  BuildingOfficeIcon, BuildingOffice2Icon, HomeModernIcon, BuildingLibraryIcon, TruckIcon, RocketLaunchIcon,
  
  // Miscellaneous
  StarIcon, FlagIcon, BookmarkIcon, MegaphoneIcon, CubeIcon, KeyIcon, PuzzlePieceIcon, BeakerIcon,
  AtSymbolIcon, HashtagIcon, QrCodeIcon, PrinterIcon, ScaleIcon, CalculatorIcon,
  NoSymbolIcon, PlusCircleIcon, MinusCircleIcon, HandRaisedIcon,
  
} from '@heroicons/react/24/outline';

// ===== HELPER FUNCTIONS =====
export const createNavIcon = (iconComponent: React.ComponentType, isActive = false) => {
  const { Icon } = require('./Icon');
  return React.createElement(Icon, {
    size: 'lg',
    color: isActive ? 'nav-item-selected' : 'nav-item',
    weight: 'medium'
  }, React.createElement(iconComponent));
};

export const createActionIcon = (iconComponent: React.ComponentType, props?: any) => {
  const { Icon } = require('./Icon');
  return React.createElement(Icon, {
    size: 'lg',
    color: 'primary',
    weight: 'medium',
    ...props
  }, React.createElement(iconComponent));
};

export const createStatusIcon = (iconComponent: React.ComponentType, status: 'success' | 'warning' | 'error' | 'info' = 'info', props?: any) => {
  const { Icon } = require('./Icon');

  // Map status to semantic color tokens
  const colorMap = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info'
  };

  return React.createElement(Icon, {
    size: 'sm',
    color: colorMap[status],
    weight: 'medium',
    ...props
  }, React.createElement(iconComponent));
};

// ===== STATUS ICON COMPONENTS =====
export const StatusIcons = {
  Success: (props?: any) => {
    const { CheckCircleIcon } = require('@heroicons/react/24/outline');
    return createStatusIcon(CheckCircleIcon, 'success', props);
  },
  Warning: (props?: any) => {
    const { ExclamationTriangleIcon } = require('@heroicons/react/24/outline');
    return createStatusIcon(ExclamationTriangleIcon, 'warning', props);
  },
  Error: (props?: any) => {
    const { XCircleIcon } = require('@heroicons/react/24/outline');
    return createStatusIcon(XCircleIcon, 'error', props);
  },
  Info: (props?: any) => {
    const { InformationCircleIcon } = require('@heroicons/react/24/outline');
    return createStatusIcon(InformationCircleIcon, 'info', props);
  },
};

// ===== DEFAULT EXPORT =====
export { Icon as default } from './Icon';