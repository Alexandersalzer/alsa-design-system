// ===============================================
// design/system/components/media/IconByName/IconByName.tsx
// JSON-FRIENDLY ICON COMPONENT - Uses icon name as string prop
// ===============================================

import React from 'react';
import { Icon, IconSize, IconColor, IconWeight } from '../Icon/Icon';

// Import commonly used Heroicons
import {
  // Media & Content
  VideoCameraIcon, CameraIcon, PhotoIcon, FilmIcon, MusicalNoteIcon, MicrophoneIcon,
  PlayIcon, PauseIcon, StopIcon, PlayCircleIcon,
  
  // Documents
  DocumentIcon, DocumentTextIcon, FolderIcon, ClipboardIcon, NewspaperIcon, BookOpenIcon,
  
  // Communication
  ChatBubbleLeftRightIcon, EnvelopeIcon, PhoneIcon, BellIcon, MegaphoneIcon,
  
  // Actions
  PencilIcon, PlusIcon, MinusIcon, CheckIcon, TrashIcon, ShareIcon, LinkIcon,
  ArrowPathIcon, MagnifyingGlassIcon, ArrowTopRightOnSquareIcon,
  
  // Navigation
  HomeIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowDownIcon,
  ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon,
  Bars3Icon, XMarkIcon,
  
  // Status & Feedback
  CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon,
  ExclamationCircleIcon, QuestionMarkCircleIcon,
  
  // Objects
  HeartIcon, StarIcon, SparklesIcon, FireIcon, LightBulbIcon, GiftIcon,
  ShoppingCartIcon, ShoppingBagIcon, CreditCardIcon, BanknotesIcon, TagIcon,
  KeyIcon, LockClosedIcon, LockOpenIcon, ShieldCheckIcon,
  
  // Users
  UserIcon, UserCircleIcon, UserGroupIcon, UsersIcon,
  
  // Settings & Tools
  Cog6ToothIcon, WrenchScrewdriverIcon, AdjustmentsHorizontalIcon,
  
  // Location & Time
  MapPinIcon, GlobeAltIcon, ClockIcon, CalendarIcon,
  
  // Charts
  ChartBarIcon, ChartPieIcon, PresentationChartLineIcon,
  
  // Tech
  ComputerDesktopIcon, DevicePhoneMobileIcon, ServerIcon, CloudIcon, WifiIcon,
  
  // Buildings & Transport
  BuildingOfficeIcon, HomeModernIcon, TruckIcon, RocketLaunchIcon,
  
  // Theme
  SunIcon, MoonIcon,
  
  // Misc
  CubeIcon, PuzzlePieceIcon, BeakerIcon, AtSymbolIcon, HashtagIcon, QrCodeIcon,
} from '@heroicons/react/24/outline';

// Icon name to component mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  // Media & Content
  'video-camera': VideoCameraIcon,
  'camera': CameraIcon,
  'photo': PhotoIcon,
  'film': FilmIcon,
  'musical-note': MusicalNoteIcon,
  'microphone': MicrophoneIcon,
  'play': PlayIcon,
  'pause': PauseIcon,
  'stop': StopIcon,
  'play-circle': PlayCircleIcon,
  'paint-brush': PaintBrushIcon,
  
  // Documents
  'document': DocumentIcon,
  'document-text': DocumentTextIcon,
  'folder': FolderIcon,
  'clipboard': ClipboardIcon,
  'newspaper': NewspaperIcon,
  'book-open': BookOpenIcon,
  
  // Communication
  'chat': ChatBubbleLeftRightIcon,
  'envelope': EnvelopeIcon,
  'phone': PhoneIcon,
  'bell': BellIcon,
  'megaphone': MegaphoneIcon,
  
  // Actions
  'pencil': PencilIcon,
  'plus': PlusIcon,
  'minus': MinusIcon,
  'check': CheckIcon,
  'trash': TrashIcon,
  'share': ShareIcon,
  'link': LinkIcon,
  'refresh': ArrowPathIcon,
  'search': MagnifyingGlassIcon,
  'external-link': ArrowTopRightOnSquareIcon,
  
  // Navigation
  'home': HomeIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-up': ArrowUpIcon,
  'arrow-down': ArrowDownIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-up': ChevronUpIcon,
  'chevron-down': ChevronDownIcon,
  'menu': Bars3Icon,
  'close': XMarkIcon,
  
  // Status & Feedback
  'check-circle': CheckCircleIcon,
  'x-circle': XCircleIcon,
  'warning': ExclamationTriangleIcon,
  'info': InformationCircleIcon,
  'error': ExclamationCircleIcon,
  'question': QuestionMarkCircleIcon,
  
  // Objects
  'heart': HeartIcon,
  'star': StarIcon,
  'sparkles': SparklesIcon,
  'fire': FireIcon,
  'lightbulb': LightBulbIcon,
  'gift': GiftIcon,
  'cart': ShoppingCartIcon,
  'bag': ShoppingBagIcon,
  'credit-card': CreditCardIcon,
  'money': BanknotesIcon,
  'tag': TagIcon,
  'key': KeyIcon,
  'lock': LockClosedIcon,
  'unlock': LockOpenIcon,
  'shield': ShieldCheckIcon,
  
  // Users
  'user': UserIcon,
  'user-circle': UserCircleIcon,
  'user-group': UserGroupIcon,
  'users': UsersIcon,
  
  // Settings & Tools
  'settings': Cog6ToothIcon,
  'tools': WrenchScrewdriverIcon,
  'adjustments': AdjustmentsHorizontalIcon,
  
  // Location & Time
  'map-pin': MapPinIcon,
  'globe': GlobeAltIcon,
  'clock': ClockIcon,
  'calendar': CalendarIcon,
  
  // Charts
  'chart-bar': ChartBarIcon,
  'chart-pie': ChartPieIcon,
  'chart-line': PresentationChartLineIcon,
  
  // Tech
  'desktop': ComputerDesktopIcon,
  'mobile': DevicePhoneMobileIcon,
  'server': ServerIcon,
  'cloud': CloudIcon,
  'wifi': WifiIcon,
  
  // Buildings & Transport
  'building': BuildingOfficeIcon,
  'house': HomeModernIcon,
  'truck': TruckIcon,
  'rocket': RocketLaunchIcon,
  
  // Theme
  'sun': SunIcon,
  'moon': MoonIcon,
  
  // Misc
  'cube': CubeIcon,
  'puzzle': PuzzlePieceIcon,
  'beaker': BeakerIcon,
  'at': AtSymbolIcon,
  'hashtag': HashtagIcon,
  'qr-code': QrCodeIcon,
};

export interface IconByNameProps {
  /** Icon name (e.g., 'camera', 'video-camera', 'heart') */
  name: string;
  /** Icon size */
  size?: IconSize;
  /** Icon color */
  color?: IconColor;
  /** Icon stroke weight */
  weight?: IconWeight;
  /** Additional CSS class */
  className?: string;
  /** Accessible label */
  'aria-label'?: string;
}

export const IconByName: React.FC<IconByNameProps> = ({
  name,
  size = 'md',
  color = 'primary',
  weight = 'regular',
  className,
  'aria-label': ariaLabel,
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap. Available icons: ${Object.keys(iconMap).join(', ')}`);
    return null;
  }

  return (
    <Icon 
      size={size} 
      color={color} 
      weight={weight} 
      className={className}
      aria-label={ariaLabel}
    >
      <IconComponent />
    </Icon>
  );
};

IconByName.displayName = 'IconByName';

// Export available icon names for documentation
export const availableIcons = Object.keys(iconMap);
