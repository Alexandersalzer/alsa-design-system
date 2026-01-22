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
}
