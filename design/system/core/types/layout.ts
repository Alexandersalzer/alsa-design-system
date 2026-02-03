// ===============================================
// Layout Types
// Defines the layout configuration for sections
// ===============================================

/**
 * Layout configuration for sections
 * Controls how patterns are arranged based on SectionHeader alignment
 */
export interface LayoutConfig {
  /**
   * Core alignment that controls the entire layout structure
   * - 'center': All patterns stacked vertically, no split layout (default)
   * - 'left' or 'right': Opens up possibility for secondColumn split layout
   */
  alignSectionHeader?: 'left' | 'center' | 'right';

  /**
   * Array of pattern keys that should appear in the first column
   * (in addition to SectionHeader and action patterns)
   * Only available when alignSectionHeader is 'left' or 'right'
   * Example: ["sparkline_growth", "testimonial_X2pQ5w"]
   */
  firstColumn?: string[];

  /**
   * Array of pattern keys that should appear in the second column
   * Only available when alignSectionHeader is 'left' or 'right'
   * Example: ["media_M8kR3p", "stats_X2pQ5w"]
   */
  secondColumn?: string[];

  /**
   * When true, ButtonGroup is placed at the bottom of the entire section
   * When false, ButtonGroup stays with SectionHeader in the same VStack (default)
   */
  distanceAction?: boolean;

  /**
   * Gap spacing between sections and columns
   * Uses CSS variable tokens: var(--space-{gap})
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /**
   * Column ratio for split layout (when secondColumn exists)
   * Controls the width distribution between first and second column
   */
  ratio?: '1:1' | '1:2' | '2:1' | '2:3' | '3:2';

  /**
   * Vertical alignment for split layout columns (CSS align-items)
   * Controls how the two columns align vertically relative to each other
   * - 'start': Align to top (default)
   * - 'center': Align to middle - great for hero sections with media
   * - 'end': Align to bottom - useful when second column has action buttons
   */
  verticalAlign?: 'start' | 'center' | 'end';

  /**
   * Vertical alignment for SectionHeader content (CSS justifyContent)
   * Controls how SectionHeader + action patterns are positioned vertically
   * - 'start': Align to top (default)
   * - 'center': Align to middle
   * - 'end': Align to bottom - useful for hero sections with tall media
   */
  sectionHeaderVerticalAlign?: 'start' | 'center' | 'end';

  /**
   * Breakpoint at which split layout stacks to single column
   * - 'tablet': Stack at 768px (default mobile behavior)
   * - 'desktop': Stack at 1024px (default - good for most split layouts)
   */
  stackAt?: 'tablet' | 'desktop';

  /**
   * Custom order of patterns when layout is stacked (mobile view)
   * If not provided, uses the default `order` array
   * Useful for reordering elements like putting an image above text on mobile
   * Example: ["media_M8kR3p", "sectionHeader_X2pQ5w", "buttonGroup_Y3wR8k"]
   */
  mobileOrder?: string[];

  /**
   * Alignment for patterns when layout is stacked (mobile view)
   * If not provided, inherits from alignSectionHeader
   * Useful when you want different alignment on mobile (e.g., center on mobile)
   */
  mobileAlign?: 'left' | 'center' | 'right';

  /**
   * Gap spacing when layout is stacked (mobile view)
   * If not provided, uses the main `gap` value
   */
  mobileGap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /**
   * When true, wraps the split layout content (header + columns) in a Card for a common background
   */
  wrapInCard?: boolean;

  /**
   * Card variant when wrapInCard is true – styr bakgrund, kant och skugga
   */
  cardVariant?: 'default' | 'raised' | 'elevated' | 'outlined' | 'solid' | 'ghost' | 'bordered' | 'accent-subtle' | 'accent-muted';

  /**
   * Card padding när wrapInCard är true
   */
  cardPadding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /**
   * Card radius när wrapInCard är true
   */
  cardRadius?: 'sm' | 'md' | 'lg';

  /**
   * Bakgrundstyp inuti kortet när wrapInCard är true (t.ex. particle, image, generative)
   */
  cardBackground?: 'particle' | 'image' | 'generative' | 'gradient' | 'pattern' | 'solid';

  /**
   * Inställningar för cardBackground – skickas till bakgrundskomponenten.
   * För particle: particleCount, particleColorScheme, particleSpeed, particleMinSize, particleMaxSize, particleMinOpacity, particleMaxOpacity, particleBlur.
   * För image: backgroundImage (url), backgroundSize, backgroundPosition, backgroundOpacity.
   */
  cardBackgroundSettings?: Record<string, unknown>;

  /**
   * Kantlinje på kortet när wrapInCard är true
   */
  cardBorderStyle?: 'none' | 'subtle' | 'solid' | 'accent';
}
