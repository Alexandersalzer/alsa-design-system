// ===============================================
// src/design-system/components/primitives/Icon/Icon.tsx
// FIXED - Compatible with existing homepage + Smart button colors
// ===============================================

import React, { forwardRef, ReactElement, cloneElement } from 'react';
import { cn } from '../../../lib/utils';

// ===== TYPE DEFINITIONS =====
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type IconColor = 
  | 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse'
  | 'heading' | 'body' | 'accent' | 'success' | 'warning' | 'error'
  | 'muted' | 'subtle' | 'nav-item' | 'nav-item-hover' | 'nav-item-selected'
  | 'user-menu' | 'search' | 'empty-state' | 'card-primary'
  | 'button-primary' | 'button-secondary' | 'button-accent' | 'button-ghost' | 'button-danger' | 'button-disabled';

export type IconWeight = 'thin' | 'light' | 'regular' | 'medium' | 'bold';

// 🆕 NEW: Button variant type for smart icon coloring
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color' | 'size'> {
  /** The icon element (SVG) to render */
  children: ReactElement;
  /** Icon size using design system tokens */
  size?: IconSize;
  /** Icon color using semantic color tokens */
  color?: IconColor;
  /** Icon stroke weight */
  weight?: IconWeight;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  'aria-label'?: string;
}

// 🆕 NEW: Button Icon Props for smart coloring
export interface ButtonIconProps extends Omit<IconProps, 'color'> {
  /** Button variant to automatically determine icon color */
  variant?: ButtonVariant;
  /** Override automatic color if needed */
  color?: IconColor;
  /** Is the button disabled? */
  disabled?: boolean;
}

// ===== SIZE MAPPING =====
const sizeMap: Record<IconSize, string> = {
  'xs': 'icon-xs',    // 12px
  'sm': 'icon-sm',    // 14px  
  'md': 'icon-md',    // 16px
  'lg': 'icon-lg',    // 20px
  'xl': 'icon-xl',    // 24px
  '2xl': 'icon-2xl'   // 32px
};

// ===== COLOR MAPPING =====
const colorMap: Record<IconColor, string> = {
  'primary': 'icon-primary',
  'secondary': 'icon-secondary', 
  'tertiary': 'icon-tertiary',
  'disabled': 'icon-disabled',
  'inverse': 'icon-inverse',
  'heading': 'icon-heading',
  'body': 'icon-body',
  'accent': 'icon-accent',
  'success': 'icon-success',
  'warning': 'icon-warning',
  'error': 'icon-error',
  'muted': 'icon-muted',
  'subtle': 'icon-subtle',
  'nav-item': 'icon-nav-item',
  'nav-item-hover': 'icon-nav-item-hover',
  'nav-item-selected': 'icon-nav-item-selected',
  'user-menu': 'icon-user-menu',
  'search': 'icon-search',
  'empty-state': 'icon-empty-state',
  'card-primary': 'icon-card-primary',
  'button-primary': 'icon-button-primary',
  'button-secondary': 'icon-button-secondary',
  'button-accent': 'icon-button-accent',
  'button-ghost': 'icon-button-ghost',
  'button-danger': 'icon-button-danger',
  'button-disabled': 'icon-button-disabled'
};

// ===== WEIGHT MAPPING =====
const weightMap: Record<IconWeight, string> = {
  'thin': 'icon-weight-thin',
  'light': 'icon-weight-light',
  'regular': 'icon-weight-regular',
  'medium': 'icon-weight-medium',
  'bold': 'icon-weight-bold'
};

// 🆕 NEW: Smart button icon color mapping
const getButtonIconColor = (variant: ButtonVariant, disabled: boolean): IconColor => {
  if (disabled) {
    return 'button-disabled'; // Uses --icon-button-disabled (gray)
  }

  switch (variant) {
    case 'primary':
      return 'button-primary';    // Uses --icon-button-primary (white on black)
    case 'secondary':
      return 'button-secondary';  // Uses --icon-button-secondary (black on light)
    case 'accent':
      return 'button-accent';     // Uses --icon-button-accent (white on accent)
    case 'ghost':
      return 'button-ghost';      // Uses --icon-button-ghost (gray for ghost)
    case 'danger':
      return 'button-danger';     // Uses --icon-button-danger (white on red)
    default:
      return 'button-primary';
  }
};

// ===== MAIN ICON COMPONENT =====
export const Icon = forwardRef<SVGSVGElement, IconProps>(({
  children,
  size = 'md',
  color = 'primary',
  weight = 'regular',
  className,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  // Build icon classes
  const iconClasses = cn(
    'icon',
    sizeMap[size],
    colorMap[color],
    weightMap[weight],
    className
  );

  // Use design system tokens for stroke-width
  const strokeWidthMap = {
    'thin': 'var(--icon-stroke-thin)',
    'light': 'var(--icon-stroke-light)', 
    'regular': 'var(--icon-stroke-regular)',
    'medium': 'var(--icon-stroke-medium)',
    'bold': 'var(--icon-stroke-bold)'
  };

  // Remove ref from props to avoid conflicts
  const cleanProps = props as React.SVGProps<SVGSVGElement>;

  // Clone the SVG child with our props AND design system stroke-width
  const iconElement = cloneElement(children, {
    ref,
    className: iconClasses,
    'aria-label': ariaLabel,
    'aria-hidden': ariaLabel ? undefined : 'true',
    focusable: 'false',
    role: ariaLabel ? 'img' : 'presentation',
    strokeWidth: strokeWidthMap[weight],
    style: {
      strokeWidth: strokeWidthMap[weight],
      ...cleanProps.style
    },
    ...cleanProps
  });

  return iconElement;
});

Icon.displayName = 'Icon';

// 🆕 NEW: Button Icon Component with Smart Coloring
export const ButtonIcon = forwardRef<SVGSVGElement, ButtonIconProps>(({
  children,
  variant = 'primary',
  disabled = false,
  color: overrideColor,
  size = 'sm',
  weight = 'medium',
  className,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  // Determine the icon color - use override if provided, otherwise smart color
  const iconColor = overrideColor || getButtonIconColor(variant, disabled);

  return (
    <Icon
      ref={ref}
      size={size}
      color={iconColor}
      weight={weight}
      className={className}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Icon>
  );
});

ButtonIcon.displayName = 'ButtonIcon';

// ===== ICON BUTTON COMPONENT =====
interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  icon: ReactElement;
  size?: IconSize;
  color?: IconColor;
  weight?: IconWeight;
  'aria-label': string;
  badge?: number | string;
  active?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  size = 'lg',
  color = 'nav-item',
  weight = 'regular',
  className,
  badge,
  active,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const buttonClasses = cn(
    'icon-btn',
    `icon-btn--${size}`,
    active && 'icon-btn--active',
    className
  );

  return (
    <button
      ref={ref}
      className={buttonClasses}
      aria-label={ariaLabel}
      {...props}
    >
      <div className="icon-btn__icon">
        <Icon size={size} color={color} weight={weight}>
          {icon}
        </Icon>
      </div>
      {badge && (
        <div className="icon-btn__badge">
          {badge}
        </div>
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';

// ===== UTILITY FUNCTIONS =====
export const createIconProps = {
  navigation: (isActive: boolean, size: IconSize = 'lg') => ({
    size,
    color: isActive ? 'nav-item-selected' as IconColor : 'nav-item' as IconColor,
    weight: 'medium' as IconWeight
  }),

  userMenu: (size: IconSize = 'lg') => ({
    size,
    color: 'user-menu' as IconColor,
    weight: 'regular' as IconWeight
  }),

  // 🔧 UPDATED: Enhanced button helper with smart coloring
  button: (variant: ButtonVariant = 'primary', size: IconSize = 'sm', disabled: boolean = false) => ({
    size,
    color: getButtonIconColor(variant, disabled),
    weight: 'medium' as IconWeight
  }),

  notification: (size: IconSize = 'lg') => ({
    size,
    color: 'nav-item' as IconColor,
    weight: 'regular' as IconWeight
  }),

  search: (size: IconSize = 'lg') => ({
    size,
    color: 'search' as IconColor,
    weight: 'regular' as IconWeight
  }),

  emptyState: (size: IconSize = '2xl') => ({
    size,
    color: 'empty-state' as IconColor,
    weight: 'regular' as IconWeight
  }),

  card: (size: IconSize = '2xl') => ({
    size,
    color: 'card-primary' as IconColor,
    weight: 'regular' as IconWeight
  })
};

// ===== CONTEXT-AWARE ICON PROPS =====
export const IconContexts = {
  // Navigation icons (sidebar)
  navigation: (isActive: boolean = false) => ({
    size: 'lg' as IconSize,
    color: isActive ? 'nav-item-selected' as IconColor : 'nav-item' as IconColor,
    weight: 'medium' as IconWeight
  }),

  // Card icons (32px, prominent)
  card: () => ({
    size: '2xl' as IconSize,
    color: 'card-primary' as IconColor,
    weight: 'regular' as IconWeight
  }),

  // Action icons (buttons, etc)
  action: () => ({
    size: 'lg' as IconSize,
    color: 'primary' as IconColor,
    weight: 'medium' as IconWeight
  }),

  // Menu icons (dropdowns, etc)
  menu: () => ({
    size: 'md' as IconSize,
    color: 'primary' as IconColor,
    weight: 'medium' as IconWeight
  }),

  // Search/input icons
  input: () => ({
    size: 'lg' as IconSize,
    color: 'search' as IconColor,
    weight: 'regular' as IconWeight
  }),

  // Empty state icons
  emptyState: () => ({
    size: '2xl' as IconSize,
    color: 'empty-state' as IconColor,
    weight: 'regular' as IconWeight
  }),

  // 🆕 NEW: Button context with smart coloring
  button: (variant: ButtonVariant = 'primary', disabled: boolean = false) => ({
    size: 'sm' as IconSize,
    color: getButtonIconColor(variant, disabled),
    weight: 'medium' as IconWeight
  })
};

// ===== HERO ICONS IMPORTS =====
import { 
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  PencilIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  ArrowTopRightOnSquareIcon,
  QuestionMarkCircleIcon,
  LockClosedIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  TrashIcon,
  ArchiveBoxIcon,
  ShareIcon,
  BookmarkIcon,
  HeartIcon,
  StarIcon,
  FlagIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderIcon,
  FolderOpenIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  PaperClipIcon,
  ClipboardIcon,
  ClipboardDocumentIcon,
  EnvelopeIcon,
  PhoneIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  CheckIcon,
  MinusIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CalendarIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChartPieIcon,
  ChartBarSquareIcon,
  TableCellsIcon,
  ListBulletIcon,
  QueueListIcon,
  Squares2X2Icon,
  Bars4Icon,
  AdjustmentsHorizontalIcon,
  WrenchScrewdriverIcon,
  PowerIcon,
  KeyIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  GiftIcon,
  TagIcon,
  ReceiptPercentIcon,
  TruckIcon,
  LinkIcon,
  QrCodeIcon,
  AtSymbolIcon,
  HashtagIcon,
  CommandLineIcon,
  CodeBracketIcon,
  ServerIcon,
  CloudIcon,
  WifiIcon,
  SignalIcon,
  BoltIcon,
  CpuChipIcon,
  WindowIcon,
  RectangleStackIcon,
  Square3Stack3DIcon,
  MapPinIcon,
  MapIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  HomeModernIcon,
  FireIcon,
  SparklesIcon,
  PuzzlePieceIcon,
  CubeIcon,
  SwatchIcon,
  PaintBrushIcon,
  CameraIcon,
  PrinterIcon,
  ScaleIcon,
  MegaphoneIcon,
  NewspaperIcon,
  AcademicCapIcon,
  BeakerIcon,
  LightBulbIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
} from '@heroicons/react/24/outline';

// ===== ICON MAPPING =====
export const IconMap = {
  // Navigation & Layout
  home: HomeIcon,
  menu: Bars3Icon,
  close: XMarkIcon,
  back: ArrowLeftIcon,
  
  // Core Dashboard Features
  website: DocumentIcon,
  chat: ChatBubbleLeftRightIcon,
  features: RocketLaunchIcon,
  domain: GlobeAltIcon,
  bell: BellIcon,
  search: MagnifyingGlassIcon,
  
  // Actions
  arrowRight: ArrowRightIcon,
  edit: PencilIcon,
  plus: PlusIcon,
  ellipsisHorizontal: EllipsisHorizontalIcon,
  ellipsisVertical: EllipsisVerticalIcon,
  externalLink: ArrowTopRightOnSquareIcon,
  help: QuestionMarkCircleIcon,
  lock: LockClosedIcon,
  delete: TrashIcon,
  copy: DocumentDuplicateIcon,
  share: ShareIcon,
  download: DocumentArrowDownIcon,
  upload: DocumentArrowUpIcon,
  view: EyeIcon,
  hide: EyeSlashIcon,
  play: PlayIcon,
  pause: PauseIcon,
  stop: StopIcon,
  
  // Users & People
  user: UserCircleIcon,
  profile: UserIcon,
  
  // Status & Feedback
  success: CheckIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  pending: ClockIcon,
  
  // Time & History
  history: ClockIcon,
  calendar: CalendarIcon,
  clock: ClockIcon,
  
  // Files & Content
  folder: FolderIcon,
  document: DocumentTextIcon,
  image: PhotoIcon,
  video: FilmIcon,
  audio: MusicalNoteIcon,
  attachment: PaperClipIcon,
  
  // Communication
  email: EnvelopeIcon,
  phone: PhoneIcon,
  videoCall: VideoCameraIcon,
  
  // Data & Analytics
  chart: ChartBarIcon,
  pie: ChartPieIcon,
  table: TableCellsIcon,
  list: ListBulletIcon,
  grid: Squares2X2Icon,
  
  // Settings & System
  settings: Cog6ToothIcon,
  tools: WrenchScrewdriverIcon,
  filters: AdjustmentsHorizontalIcon,
  power: PowerIcon,
  key: KeyIcon,
  security: ShieldCheckIcon,
  
  // E-commerce
  money: CurrencyDollarIcon,
  card: CreditCardIcon,
  cart: ShoppingCartIcon,
  bag: ShoppingBagIcon,
  gift: GiftIcon,
  tag: TagIcon,
  shipping: TruckIcon,
  
  // Social & Connectivity
  link: LinkIcon,
  qr: QrCodeIcon,
  at: AtSymbolIcon,
  hashtag: HashtagIcon,
  
  // Location
  location: MapPinIcon,
  map: MapIcon,
  office: BuildingOfficeIcon,
  store: BuildingStorefrontIcon,
  
  // UI Controls
  chevronDown: ChevronDownIcon,
  chevronUp: ChevronUpIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  
  // Miscellaneous
  fire: FireIcon,
  sparkles: SparklesIcon,
  plugin: PuzzlePieceIcon,
  star: StarIcon,
  heart: HeartIcon,
  bookmark: BookmarkIcon,
  camera: CameraIcon,
  printer: PrinterIcon,
  idea: LightBulbIcon,
  logout: ArrowRightOnRectangleIcon,
  minus: MinusIcon,
};

// ===== 🔧 FIXED: ICONS COLLECTION THAT MATCHES YOUR HOMEPAGE =====
export const Icons = {
  // ✅ Navigation Context - MATCHES YOUR HOMEPAGE
  Nav: {
    Home: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(false)} {...props}>
        <HomeIcon />
      </Icon>
    ),
    HomeActive: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(true)} {...props}>
        <HomeIcon />
      </Icon>
    ),
    Website: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(false)} {...props}>
        <DocumentIcon />
      </Icon>
    ),
    WebsiteActive: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(true)} {...props}>
        <DocumentIcon />
      </Icon>
    ),
    Chat: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(false)} {...props}>
        <ChatBubbleLeftRightIcon />
      </Icon>
    ),
    ChatActive: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(true)} {...props}>
        <ChatBubbleLeftRightIcon />
      </Icon>
    ),
    Features: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(false)} {...props}>
        <RocketLaunchIcon />
      </Icon>
    ),
    FeaturesActive: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(true)} {...props}>
        <RocketLaunchIcon />
      </Icon>
    ),
    Domain: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(false)} {...props}>
        <GlobeAltIcon />
      </Icon>
    ),
    DomainActive: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(true)} {...props}>
        <GlobeAltIcon />
      </Icon>
    ),
    History: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(false)} {...props}>
        <ClockIcon />
      </Icon>
    ),
    HistoryActive: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(true)} {...props}>
        <ClockIcon />
      </Icon>
    )
  },

  // ✅ Card Context - MATCHES YOUR HOMEPAGE
  Card: {
    Home: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.card()} {...props}>
        <HomeIcon />
      </Icon>
    ),
    Website: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.card()} {...props}>
        <DocumentIcon />
      </Icon>
    ),
    Chat: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.card()} {...props}>
        <ChatBubbleLeftRightIcon />
      </Icon>
    ),
    Features: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.card()} {...props}>
        <RocketLaunchIcon />
      </Icon>
    ),
    Domain: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.card()} {...props}>
        <GlobeAltIcon />
      </Icon>
    ),
    History: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.card()} {...props}>
        <ClockIcon />
      </Icon>
    )
  },

  // ✅ Action Context - MATCHES YOUR HOMEPAGE EXACTLY
  Action: {
    ArrowRight: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-primary" weight="medium" {...props}>
        <ArrowRightIcon />
      </Icon>
    ),
    Close: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-ghost" weight="medium" {...props}>
        <XMarkIcon />
      </Icon>
    ),
    Edit: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-secondary" weight="medium" {...props}>
        <PencilIcon />
      </Icon>
    ),
    Plus: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-primary" weight="medium" {...props}>
        <PlusIcon />
      </Icon>
    ),
    MoreHorizontal: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-ghost" weight="medium" {...props}>
        <EllipsisHorizontalIcon />
      </Icon>
    ),
    MoreVertical: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-ghost" weight="medium" {...props}>
        <EllipsisVerticalIcon />
      </Icon>
    ),
    ExternalLink: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-primary" weight="medium" {...props}>
        <ArrowTopRightOnSquareIcon />
      </Icon>
    ),
    Help: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-ghost" weight="regular" {...props}>
        <QuestionMarkCircleIcon />
      </Icon>
    ),
    Lock: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-secondary" weight="medium" {...props}>
        <LockClosedIcon />
      </Icon>
    ),
    Copy: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-secondary" weight="medium" {...props}>
        <DocumentDuplicateIcon />
      </Icon>
    ),
    History: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-ghost" weight="medium" {...props}>
        <ClockIcon />
      </Icon>
    ),
    Delete: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-danger" weight="medium" {...props}>
        <TrashIcon />
      </Icon>
    ),
    Share: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-secondary" weight="medium" {...props}>
        <ShareIcon />
      </Icon>
    ),
    Download: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-primary" weight="medium" {...props}>
        <DocumentArrowDownIcon />
      </Icon>
    ),
    Upload: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-primary" weight="medium" {...props}>
        <DocumentArrowUpIcon />
      </Icon>
    ),
    View: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-secondary" weight="medium" {...props}>
        <EyeIcon />
      </Icon>
    ),
    Hide: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="button-ghost" weight="medium" {...props}>
        <EyeSlashIcon />
      </Icon>
    ),
    Bell: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.notification()} {...props}>
        <BellIcon />
      </Icon>
    ),
    Search: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.search()} {...props}>
        <MagnifyingGlassIcon />
      </Icon>
    ),
    User: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.userMenu()} {...props}>
        <UserCircleIcon />
      </Icon>
    ),
    ChevronDown: (props: Partial<IconProps> = {}) => (
      <Icon color="tertiary" weight="medium" {...props}>
        <ChevronDownIcon />
      </Icon>
    )
  },

  // 🆕 NEW: Smart Button Context - For new enhanced icons
  Button: {
    // Arrow Right for different button variants
    ArrowRight: (variant: ButtonVariant = 'primary', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <ArrowRightIcon />
      </ButtonIcon>
    ),
    
    // Plus for different button variants
    Plus: (variant: ButtonVariant = 'primary', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <PlusIcon />
      </ButtonIcon>
    ),
    
    // Edit for different button variants
    Edit: (variant: ButtonVariant = 'secondary', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <PencilIcon />
      </ButtonIcon>
    ),
    
    // Copy for different button variants
    Copy: (variant: ButtonVariant = 'secondary', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <DocumentDuplicateIcon />
      </ButtonIcon>
    ),
    
    // Delete for different button variants
    Delete: (variant: ButtonVariant = 'danger', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <TrashIcon />
      </ButtonIcon>
    ),
    
    // Share for different button variants
    Share: (variant: ButtonVariant = 'secondary', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <ShareIcon />
      </ButtonIcon>
    ),
    
    // Download for different button variants
    Download: (variant: ButtonVariant = 'primary', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <DocumentArrowDownIcon />
      </ButtonIcon>
    ),
    
    // Upload for different button variants
    Upload: (variant: ButtonVariant = 'primary', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <DocumentArrowUpIcon />
      </ButtonIcon>
    ),
    
    // More options for different button variants
    MoreHorizontal: (variant: ButtonVariant = 'ghost', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <EllipsisHorizontalIcon />
      </ButtonIcon>
    ),
    
    // Close for different button variants
    Close: (variant: ButtonVariant = 'ghost', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <XMarkIcon />
      </ButtonIcon>
    ),
    
    // Help for different button variants
    Help: (variant: ButtonVariant = 'ghost', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <QuestionMarkCircleIcon />
      </ButtonIcon>
    ),
    
    // External Link for different button variants
    ExternalLink: (variant: ButtonVariant = 'primary', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <ArrowTopRightOnSquareIcon />
      </ButtonIcon>
    ),
    
    // Lock for different button variants
    Lock: (variant: ButtonVariant = 'secondary', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <LockClosedIcon />
      </ButtonIcon>
    ),
    
    // History for different button variants
    History: (variant: ButtonVariant = 'ghost', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <ClockIcon />
      </ButtonIcon>
    ),

    // View for different button variants
    View: (variant: ButtonVariant = 'secondary', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <EyeIcon />
      </ButtonIcon>
    ),

    // Hide for different button variants
    Hide: (variant: ButtonVariant = 'ghost', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <EyeSlashIcon />
      </ButtonIcon>
    )
  },

  // ✅ Status Context
  Status: {
    Success: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="success" weight="medium" {...props}>
        <CheckIcon />
      </Icon>
    ),
    Error: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="error" weight="medium" {...props}>
        <XCircleIcon />
      </Icon>
    ),
    Warning: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="warning" weight="medium" {...props}>
        <ExclamationTriangleIcon />
      </Icon>
    ),
    Info: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="accent" weight="medium" {...props}>
        <InformationCircleIcon />
      </Icon>
    ),
    Pending: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="secondary" weight="medium" {...props}>
        <ClockIcon />
      </Icon>
    )
  },

  // ✅ Data Context
  Data: {
    Chart: (props: Partial<IconProps> = {}) => (
      <Icon size="lg" color="primary" weight="medium" {...props}>
        <ChartBarIcon />
      </Icon>
    ),
    Pie: (props: Partial<IconProps> = {}) => (
      <Icon size="lg" color="primary" weight="medium" {...props}>
        <ChartPieIcon />
      </Icon>
    ),
    Table: (props: Partial<IconProps> = {}) => (
      <Icon size="lg" color="primary" weight="medium" {...props}>
        <TableCellsIcon />
      </Icon>
    ),
    List: (props: Partial<IconProps> = {}) => (
      <Icon size="lg" color="primary" weight="medium" {...props}>
        <ListBulletIcon />
      </Icon>
    ),
    Grid: (props: Partial<IconProps> = {}) => (
      <Icon size="lg" color="primary" weight="medium" {...props}>
        <Squares2X2Icon />
      </Icon>
    )
  },

  // ✅ Menu Context
  Menu: {
    Profile: (props: Partial<IconProps> = {}) => (
      <Icon size="md" color="primary" weight="medium" {...props}>
        <UserIcon />
      </Icon>
    ),
    Settings: (props: Partial<IconProps> = {}) => (
      <Icon size="md" color="primary" weight="medium" {...props}>
        <Cog6ToothIcon />
      </Icon>
    ),
    Logout: (props: Partial<IconProps> = {}) => (
      <Icon size="md" color="error" weight="medium" {...props}>
        <ArrowRightOnRectangleIcon />
      </Icon>
    ),
    History: (props: Partial<IconProps> = {}) => (
      <Icon size="md" color="primary" weight="medium" {...props}>
        <ClockIcon />
      </Icon>
    )
  },

  // ✅ Empty State Context
  EmptyState: {
    Bell: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.emptyState()} {...props}>
        <BellIcon />
      </Icon>
    ),
    Search: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.emptyState()} {...props}>
        <MagnifyingGlassIcon />
      </Icon>
    ),
    Document: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.emptyState()} {...props}>
        <DocumentIcon />
      </Icon>
    ),
    History: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.emptyState()} {...props}>
        <ClockIcon />
      </Icon>
    )
  }
};

// ===== SMART TAB ICON HELPER =====
export const createTabIcon = (
  iconName: keyof typeof IconMap,
  isActive: boolean,
  variant: 'navigation' | 'card' | 'page' = 'navigation'
) => {
  const IconComponent = IconMap[iconName];
  
  if (variant === 'card') {
    return (
      <Icon {...IconContexts.card()}>
        <IconComponent />
      </Icon>
    );
  }
  
  return (
    <Icon {...IconContexts.navigation(isActive)}>
      <IconComponent />
    </Icon>
  );
};

// ===== EASY ICON ADDITION HELPER =====
export const addIcon = (name: string, HeroIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>) => {
  return {
    // Add to navigation context
    nav: (isActive: boolean = false, props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.navigation(isActive)} {...props}>
        <HeroIcon />
      </Icon>
    ),
    
    // Add to card context
    card: (props: Partial<IconProps> = {}) => (
      <Icon {...createIconProps.card()} {...props}>
        <HeroIcon />
      </Icon>
    ),
    
    // Add to action context
    action: (props: Partial<IconProps> = {}) => (
      <Icon size="sm" color="primary" weight="medium" {...props}>
        <HeroIcon />
      </Icon>
    ),
    
    // Add to button context with smart coloring
    button: (variant: ButtonVariant = 'primary', disabled: boolean = false, props: Partial<IconProps> = {}) => (
      <ButtonIcon variant={variant} disabled={disabled} {...props}>
        <HeroIcon />
      </ButtonIcon>
    ),
    
    // Add to menu context
    menu: (props: Partial<IconProps> = {}) => (
      <Icon size="md" color="primary" weight="medium" {...props}>
        <HeroIcon />
      </Icon>
    ),
    
    // Raw icon with custom props
    raw: (props: Partial<IconProps> = {}) => (
      <Icon {...props}>
        <HeroIcon />
      </Icon>
    )
  };
};

// ===== USAGE EXAMPLES & DOCUMENTATION =====
/*
// ✅ HOW TO USE YOUR ENHANCED ICON SYSTEM:

// 1. EXISTING HOMEPAGE COMPATIBILITY - All these still work exactly as before:
<Icons.Action.ArrowRight />         // Standard action icon (current homepage uses this)
<Icons.Nav.Home />                  // Navigation icon
<Icons.Card.Website />              // Card icon

// 2. NEW SMART BUTTON ICONS - Automatically match button text color:
<Icons.Button.ArrowRight('primary') />        // White icon on black button
<Icons.Button.ArrowRight('secondary') />      // Black icon on light button
<Icons.Button.ArrowRight('accent') />         // White icon on accent button
<Icons.Button.ArrowRight('ghost') />          // Gray icon on ghost button
<Icons.Button.ArrowRight('danger') />         // White icon on red button

// 3. BUTTON ICONS WITH DISABLED STATE
<Icons.Button.Plus('primary', false) />       // Normal primary plus
<Icons.Button.Plus('primary', true) />        // Disabled gray plus
<Icons.Button.Edit('secondary', false) />     // Normal secondary edit
<Icons.Button.Edit('secondary', true) />      // Disabled gray edit

// 4. BUTTON ICONS WITH CUSTOM PROPS
<Icons.Button.Copy('secondary', false, { size: 'md', className: 'my-icon' }) />

// 5. USING THE ButtonIcon COMPONENT DIRECTLY
<ButtonIcon variant="primary" disabled={false}>
  <ArrowRightIcon />
</ButtonIcon>

// 6. MIGRATION PATH - You can upgrade gradually:
// Old way (still works):
<Button variant="primary" rightIcon={<Icons.Action.ArrowRight />}>Save</Button>

// New way (smart colors):
<Button variant="primary" rightIcon={<Icons.Button.ArrowRight('primary') />}>Save</Button>

// 7. ICON COLOR CUSTOMIZATION - You can override colors:
<Icon color="button-primary" size="sm">
  <ArrowRightIcon />
</Icon>

<Icon color="button-secondary" size="sm">
  <PencilIcon />
</Icon>

<Icon color="button-accent" size="sm">
  <PlusIcon />
</Icon>

<Icon color="button-ghost" size="sm">
  <QuestionMarkCircleIcon />
</Icon>

<Icon color="button-danger" size="sm">
  <TrashIcon />
</Icon>

<Icon color="button-disabled" size="sm">
  <LockClosedIcon />
</Icon>

*/

export default Icon;