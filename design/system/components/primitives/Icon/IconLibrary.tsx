// ===============================================
// src/design-system/components/primitives/Icon/IconLibrary.tsx
// NEW CLEAN ICON SYSTEM - Your preferred pattern
// ===============================================

import React, { forwardRef, ReactElement, cloneElement } from 'react';
import { cn } from '../../../lib/utils';

// ===== KEEP ALL YOUR EXISTING TYPES & MAPPINGS =====
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

// ===== YOUR EXISTING MAPPINGS (KEEP EXACT SAME) =====
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

// ===== NEW CLEAN ICON COMPONENT (Your preferred pattern) =====
export const Icon = forwardRef<SVGSVGElement, IconProps>(({
  children, size = 'md', color = 'primary', weight = 'regular', className, 'aria-label': ariaLabel, ...props
}, ref) => {
  const iconClasses = cn('icon', sizeMap[size], colorMap[color], weightMap[weight], className);
  
  const strokeWidthMap = {
    'thin': 'var(--icon-stroke-thin)', 'light': 'var(--icon-stroke-light)', 
    'regular': 'var(--icon-stroke-regular)', 'medium': 'var(--icon-stroke-medium)', 'bold': 'var(--icon-stroke-bold)'
  };

  const { ref: _, ...cleanProps } = props as any;

  const iconElement = cloneElement(children, {
    ref,
    className: iconClasses,
    'aria-label': ariaLabel,
    'aria-hidden': ariaLabel ? undefined : 'true',
    focusable: 'false',
    role: ariaLabel ? 'img' : 'presentation',
    strokeWidth: strokeWidthMap[weight],
    style: { strokeWidth: strokeWidthMap[weight], ...cleanProps.style },
    ...cleanProps
  });

  return iconElement;
});

Icon.displayName = 'Icon';

// ===============================================
// CENTRALIZED ICON LIBRARY FOR EASY EXTENSION
// ===============================================

// Import commonly used icons (add more as needed)
import {
  // Theme
  SunIcon, MoonIcon,
  
  // Navigation & Core
  HomeIcon, Bars3Icon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowDownIcon,
  ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon,
  
  // Actions
  PlusIcon, PencilIcon, TrashIcon, CheckIcon, ShareIcon, EllipsisHorizontalIcon,
  EyeIcon, EyeSlashIcon, ArrowPathIcon, ArrowTopRightOnSquareIcon,
  
  // Documents & Content
  DocumentIcon, DocumentTextIcon, DocumentDuplicateIcon, 
  DocumentArrowDownIcon, DocumentArrowUpIcon, FolderIcon, ClipboardIcon,
  
  // Users & Communication
  UserIcon, UserCircleIcon, UsersIcon, EnvelopeIcon, PhoneIcon,
  ChatBubbleLeftRightIcon, BellIcon, BellAlertIcon,
  
  // Status & Feedback
  CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon,
  InformationCircleIcon, QuestionMarkCircleIcon, LightBulbIcon,
  LockClosedIcon, LockOpenIcon,
  
  // Media
  PhotoIcon, CameraIcon, VideoCameraIcon, PlayIcon, PauseIcon,
  
  // Tech & System
  ComputerDesktopIcon, DevicePhoneMobileIcon, CloudIcon, 
  Cog6ToothIcon, WrenchScrewdriverIcon,
  ServerIcon,              // ✅ For domain management
  WifiIcon,                // ✅ Network connectivity
  SignalIcon,              // ✅ Signal/connection
  ShieldCheckIcon,         // ✅ Security/SSL
  KeyIcon,                 // ✅ Access/permissions
  IdentificationIcon,      // ✅ Identity/credentials
  CubeIcon,      
  
  // Business
  CurrencyDollarIcon, ShoppingCartIcon, BuildingStorefrontIcon,
  ChartBarIcon, PresentationChartBarIcon,
  
  // Misc & Website Specific
  GlobeAltIcon, MapPinIcon, CalendarIcon, ClockIcon, StarIcon,
  TagIcon, BookmarkIcon, MagnifyingGlassIcon, LinkIcon,
  RocketLaunchIcon, AcademicCapIcon, HashtagIcon, AtSymbolIcon,
  ArchiveBoxIcon, BuildingOfficeIcon, HeartIcon, HandThumbUpIcon, FireIcon
} from '@heroicons/react/24/outline';

// ===== EASY-TO-EXTEND ICON LIBRARY =====
export const IconLibrary = {
  // Theme
  'sun': SunIcon,
  'moon': MoonIcon,
  
  // Navigation
  'home': HomeIcon,
  'menu': Bars3Icon,
  'close': XMarkIcon,
  'back': ArrowLeftIcon,
  'forward': ArrowRightIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-up': ArrowUpIcon,
  'arrow-down': ArrowDownIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-up': ChevronUpIcon,
  'chevron-down': ChevronDownIcon,
  
  // Actions
  'add': PlusIcon,
  'plus': PlusIcon,
  'edit': PencilIcon,
  'delete': TrashIcon,
  'trash': TrashIcon,
  'check': CheckIcon,
  'share': ShareIcon,
  'more': EllipsisHorizontalIcon,
  'view': EyeIcon,
  'hide': EyeSlashIcon,
  'refresh': ArrowPathIcon,
  'external-link': ArrowTopRightOnSquareIcon,
  
  // Documents
  'document': DocumentIcon,
  'document-text': DocumentTextIcon,
  'copy': DocumentDuplicateIcon,
  'duplicate': DocumentDuplicateIcon,
  'download': DocumentArrowDownIcon,
  'upload': DocumentArrowUpIcon,
  'folder': FolderIcon,
  'clipboard': ClipboardIcon,
  'archive': ArchiveBoxIcon,
  
  // Users
  'user': UserIcon,
  'user-circle': UserCircleIcon,
  'users': UsersIcon,
  
  // Communication
  'email': EnvelopeIcon,
  'phone': PhoneIcon,
  'chat': ChatBubbleLeftRightIcon,
  'notification': BellIcon,
  'bell': BellIcon,
  'bell-alert': BellAlertIcon,
  
  // Status
  'success': CheckCircleIcon,
  'error': XCircleIcon,
  'warning': ExclamationTriangleIcon,
  'info': InformationCircleIcon,
  'question': QuestionMarkCircleIcon,
  'help': QuestionMarkCircleIcon,
  'idea': LightBulbIcon,
  'lock': LockClosedIcon,
  'unlock': LockOpenIcon,
  
  // Media
  'photo': PhotoIcon,
  'camera': CameraIcon,
  'video': VideoCameraIcon,
  'play': PlayIcon,
  'pause': PauseIcon,
  
  // Tech
  'desktop': ComputerDesktopIcon,
  'mobile': DevicePhoneMobileIcon,
  'cloud': CloudIcon,
  'settings': Cog6ToothIcon,
  'tools': WrenchScrewdriverIcon,
  'server': ServerIcon,
  'network': WifiIcon,
  'wifi': WifiIcon,
  'signal': SignalIcon,
  'shield': ShieldCheckIcon,
  'security': ShieldCheckIcon,
  'key': KeyIcon,
  'access': KeyIcon,
  'id': IdentificationIcon,
  'credential': IdentificationIcon,
  'package': CubeIcon,
  'container': CubeIcon,
  
  
  // Business
  'money': CurrencyDollarIcon,
  'cart': ShoppingCartIcon,
  'store': BuildingStorefrontIcon,
  'chart': ChartBarIcon,
  'presentation': PresentationChartBarIcon,
  'office': BuildingOfficeIcon,
  
  // Misc - Including your specific navigation needs
  'globe': GlobeAltIcon,
  'website': GlobeAltIcon,  // Maps to same icon
  'location': MapPinIcon,
  'calendar': CalendarIcon,
  'clock': ClockIcon,
  'time': ClockIcon,
  'star': StarIcon,
  'tag': TagIcon,
  'bookmark': BookmarkIcon,
  'search': MagnifyingGlassIcon,
  'link': LinkIcon,
  'features': RocketLaunchIcon,
  'rocket': RocketLaunchIcon,
  'academic': AcademicCapIcon,
  'hashtag': HashtagIcon,
  'at': AtSymbolIcon,
  'heart': HeartIcon,
  'like': HandThumbUpIcon,
  'fire': FireIcon,
  'domain': GlobeAltIcon,    // Maps to same icon as website/globe
  'history': ClockIcon,      // Maps to same icon as clock/time
} as const;

// ===== LIBRARY ICON HELPER (Alternative easy usage) =====
interface LibraryIconProps extends Omit<IconProps, 'children'> {
  name: keyof typeof IconLibrary;
}

export const LibIcon = forwardRef<SVGSVGElement, LibraryIconProps>(({ 
  name, ...props 
}, ref) => {
  const IconComponent = IconLibrary[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in IconLibrary`);
    return <Icon ref={ref} {...props}><QuestionMarkCircleIcon /></Icon>;
  }
  
  return (
    <Icon ref={ref} {...props}>
      <IconComponent />
    </Icon>
  );
});

LibIcon.displayName = 'LibIcon';

// ===============================================
// BACKWARDS COMPATIBILITY - Keep existing Icons object working
// ===============================================

export const Icons = {
  Nav: {
    Home: (isActive = false) => <LibIcon name="home" color={isActive ? 'nav-item-selected' : 'nav-item'} size="lg" weight="medium" />,
    Website: (isActive = false) => <LibIcon name="website" color={isActive ? 'nav-item-selected' : 'nav-item'} size="lg" weight="medium" />,
    Chat: (isActive = false) => <LibIcon name="chat" color={isActive ? 'nav-item-selected' : 'nav-item'} size="lg" weight="medium" />,
    Features: (isActive = false) => <LibIcon name="features" color={isActive ? 'nav-item-selected' : 'nav-item'} size="lg" weight="medium" />,
    Domain: (isActive = false) => <LibIcon name="domain" color={isActive ? 'nav-item-selected' : 'nav-item'} size="lg" weight="medium" />,
    History: (isActive = false) => <LibIcon name="history" color={isActive ? 'nav-item-selected' : 'nav-item'} size="lg" weight="medium" />,
  },
  
  Action: {
    Lock: () => <LibIcon name="lock" size="lg" color="primary" weight="medium" />,
    Edit: () => <LibIcon name="edit" size="lg" color="primary" weight="medium" />,
    Delete: () => <LibIcon name="delete" size="lg" color="primary" weight="medium" />,
    Add: () => <LibIcon name="add" size="lg" color="primary" weight="medium" />,
    More: () => <LibIcon name="more" size="lg" color="primary" weight="medium" />,
    Settings: () => <LibIcon name="settings" size="lg" color="primary" weight="medium" />,
    ArrowRight: () => <LibIcon name="arrow-right" size="lg" color="primary" weight="medium" />,
    ArrowLeft: () => <LibIcon name="arrow-left" size="lg" color="primary" weight="medium" />,
    Search: () => <LibIcon name="search" size="lg" color="primary" weight="medium" />,
    Bell: () => <LibIcon name="bell" size="lg" color="primary" weight="medium" />,
    User: () => <LibIcon name="user-circle" size="lg" color="primary" weight="medium" />,
    Close: () => <LibIcon name="close" size="lg" color="primary" weight="medium" />,
    Save: () => <LibIcon name="check" size="lg" color="primary" weight="medium" />,
    Copy: () => <LibIcon name="copy" size="lg" color="primary" weight="medium" />,
    Share: () => <LibIcon name="share" size="lg" color="primary" weight="medium" />,
    Download: () => <LibIcon name="download" size="lg" color="primary" weight="medium" />,
    Upload: () => <LibIcon name="upload" size="lg" color="primary" weight="medium" />,
    View: () => <LibIcon name="view" size="lg" color="primary" weight="medium" />,
    Hide: () => <LibIcon name="hide" size="lg" color="primary" weight="medium" />,
    Help: () => <LibIcon name="question" size="lg" color="primary" weight="medium" />,
    History: () => <LibIcon name="history" size="lg" color="primary" weight="medium" />,
    ChevronDown: () => <LibIcon name="chevron-down" size="lg" color="primary" weight="medium" />,
    ExternalLink: () => <LibIcon name="external-link" size="lg" color="primary" weight="medium" />,
    Refresh: () => <LibIcon name="refresh" size="lg" color="primary" weight="medium" />,
  },
  
  Status: {
    Warning: () => <LibIcon name="warning" size="sm" color="warning" weight="medium" />,
    Success: () => <LibIcon name="success" size="sm" color="success" weight="medium" />,
    Error: () => <LibIcon name="error" size="sm" color="error" weight="medium" />,
    Info: () => <LibIcon name="info" size="sm" color="accent" weight="medium" />,
  },

  Card: {
    Home: () => <LibIcon name="home" size="2xl" color="card-primary" weight="regular" />,
    Website: () => <LibIcon name="website" size="2xl" color="card-primary" weight="regular" />,
    Chat: () => <LibIcon name="chat" size="2xl" color="card-primary" weight="regular" />,
    Features: () => <LibIcon name="features" size="2xl" color="card-primary" weight="regular" />,
    Domain: () => <LibIcon name="domain" size="2xl" color="card-primary" weight="regular" />,
    History: () => <LibIcon name="history" size="2xl" color="card-primary" weight="regular" />,
  }
};

// Keep SimpleIcon for backwards compatibility
export const SimpleIcon = LibIcon;

// ===============================================
// UTILITY FUNCTIONS FOR EXTENSION
// ===============================================

export const hasIcon = (name: string): name is keyof typeof IconLibrary => {
  return name in IconLibrary;
};

export const getAvailableIcons = (): string[] => {
  return Object.keys(IconLibrary);
};

export const addIconToLibrary = (name: string, component: React.ComponentType) => {
  // This would be used in development to easily add new icons
  console.log(`To add icon "${name}", update IconLibrary in IconLibrary.tsx`);
};

export default Icon;