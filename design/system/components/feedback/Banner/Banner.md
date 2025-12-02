// ===============================================
// DISCRETE ACCENT BANNER - COMPLETE SETUP GUIDE
// ===============================================

/**
 * YOU NOW HAVE 4 FILES:
 * 
 * 1. banner-tokens.css
 *    → Add to src/design-system/tokens/component/notifications.css
 *    → Defines all banner color tokens + spacing tokens
 *    → Theme-aware (light/dark mode compatible)
 * 
 * 2. Banner-simple.tsx
 *    → Replace src/design-system/components/primitives/Banner/Banner.tsx
 *    → Clean, simple component (no variants, one purpose)
 *    → Single-line message with optional icon + action button
 * 
 * 3. Banner-simple.css
 *    → Replace src/design-system/components/primitives/Banner/Banner.css
 *    → Full-width, no border-radius styling
 *    → Token-based colors only
 * 
 * 4. StepWizard-banner-fixed.tsx
 *    → Replace your current StepWizard.tsx
 *    → Banner in separate container (not affected by left panel)
 *    → Full-width visibility guaranteed
 */

// ===============================================
// KEY FEATURES
// ===============================================

/**
 * ✓ FULL WIDTH - No border-radius, edge-to-edge
 * ✓ NOT HIDDEN - Banner wrapper outside panel flow
 * ✓ TOKEN-BASED - Uses CSS variables, no hardcoded colors
 * ✓ THEME AWARE - Works in light AND dark mode
 * ✓ ACCENT COLOR - Discrete, uses your brand color
 * ✓ URGENCY VARIANTS:
 *   - success: many spots available (green)
 *   - warning: limited spots (yellow/orange)
 *   - error: fully booked (red)
 * ✓ SINGLE LINE - Clean, not cluttered
 * ✓ RESPONSIVE - Stacks on mobile
 * ✓ ICON + MESSAGE + ACTION - Flexible content
 */

// ===============================================
// USAGE IN STEPWIZARD
// ===============================================

/**
 * Banner is displayed above everything:
 * 
 * ┌─────────────────────────────────────────────┐
 * │  🔔 5 av 10 platser lediga (50% fullt)     │  ← Banner wrapper (full width)
 * └─────────────────────────────────────────────┘
 * ┌─────────────────────────────────────────────┐
 * │ ╔═════════════════════════════════════════╗ │
 * │ ║ [Design Panel] │ Main Content...       ║ │  ← Main layout
 * │ ║                │                       ║ │
 * │ ╚═════════════════════════════════════════╝ │
 * └─────────────────────────────────────────────┘
 */

/**
 * COMPONENT HIERARCHY:
 * 
 * <div class="min-h-screen">
 *   {/* BANNER WRAPPER - FULL WIDTH, OUTSIDE PANEL */}
 *   <div class="banner-wrapper">
 *     <AvailabilityBanner ... />
 *   </div>
 * 
 *   {/* MAIN LAYOUT - DESIGN PANEL + CONTENT */}
 *   <div class="step-wizard-layout">
 *     <LiveDesignPanel ... />
 *     <div class="main-content">
 *       <Stepper ... />
 *       <Content ... />
 *     </div>
 *   </div>
 * </div>
 */

// ===============================================
// TOKEN SYSTEM
// ===============================================

/**
 * BANNER TOKENS IN notifications.css:
 * 
 * Base:
 * - --radius-banner: 0 (no border-radius)
 * - --space-banner-padding-y: var(--foundation-space-3)
 * - --space-banner-padding-x: var(--foundation-space-6)
 * - --space-banner-gap: var(--foundation-space-3)
 * 
 * Types (all use white text on colored background):
 * - --surface-banner-default: var(--accent-600)
 * - --text-banner-default: var(--surface-page)
 * 
 * - --surface-banner-loading: var(--accent-500)
 * - --text-banner-loading: var(--surface-page)
 * 
 * - --surface-banner-success: var(--success-600)
 * - --text-banner-success: var(--surface-page)
 * 
 * - --surface-banner-warning: var(--warning-600)
 * - --text-banner-warning: var(--surface-page)
 * 
 * - --surface-banner-error: var(--error-600)
 * - --text-banner-error: var(--surface-page)
 * 
 * COLORS ADAPT TO THEME:
 * Light mode: Bright accent, green, yellow, red
 * Dark mode: Same colors (white text always visible)
 */

// ===============================================
// COMPONENT API
// ===============================================

/**
 * Simple Banner:
 */
import { Banner } from '@/design-system/components/primitives/Banner';

<Banner
  message="5 av 10 platser lediga"
  type="success"
  icon={<CheckIcon />}
  actionText="Börja nu"
  onAction={() => scroll()}
/>

/**
 * Availability Banner (auto-determines type):
 */
import { AvailabilityBanner } from '@/design-system/components/primitives/Banner';

<AvailabilityBanner
  availableSpots={5}
  totalSpots={10}
  isLoading={false}
  error={null}
  showAction={true}
  onAction={() => scrollToForm()}
/>

/**
 * Convenience exports:
 */
<InfoBanner message="New update available" />
<SuccessBanner message="Lots of spots available" />
<WarningBanner message="Only 2 spots left!" />
<ErrorBanner message="Fully booked" />
<LoadingBanner message="Checking availability..." />

// ===============================================
// AVAILABILITY LOGIC
// ===============================================

/**
 * AvailabilityBanner automatically determines:
 * 
 * LOADING:
 * - Message: "Kontrollerar tillgängliga platser..."
 * - Type: loading
 * - Animation: subtle pulse
 * 
 * ERROR:
 * - Message: Shows error message
 * - Type: error (red)
 * 
 * FULLY BOOKED (availableSpots === 0):
 * - Message: "Attans! Alla 10 platser är fulla..."
 * - Type: error (red)
 * - No action button
 * 
 * LIMITED (availableSpots <= 2):
 * - Message: "Bara 2 platser kvar av 10!"
 * - Type: warning (yellow)
 * - Urgent tone
 * 
 * PLENTY (availableSpots > 2):
 * - Message: "5 av 10 platser lediga (50% fullt)"
 * - Type: success (green)
 * - Calm tone
 */

// ===============================================
// STYLING DETAILS
// ===============================================

/**
 * LAYOUT:
 * - Full width with internal padding only
 * - No external margin or border-radius
 * - Flexbox: icon | message | action
 * - Min height: 56px for good touch targets
 * 
 * RESPONSIVE:
 * Desktop (768px+):
 * ├─ Icon (20x20) │ Message │ Action Button ┤
 * 
 * Mobile (<768px):
 * ├─ Icon │ Message ┤
 * ├─ Action Button (align right) ┤
 * 
 * Tiny (<480px):
 * ├─ Smaller icon (18x18)
 * ├─ Smaller text
 * ├─ Smaller padding
 * 
 * ANIMATIONS:
 * - Loading state: subtle pulse animation
 * - Respects prefers-reduced-motion
 * - Smooth color transitions
 */

/**
 * ACCESSIBILITY:
 * ✓ role="status"
 * ✓ aria-live="polite"
 * ✓ Sufficient color contrast (white on colored)
 * ✓ Focus states on action button
 * ✓ Readable at all zoom levels
 * ✓ Works with screen readers
 */

// ===============================================
// SETUP CHECKLIST
// ===============================================

/**
 * 1. ADD TOKENS:
 *    ☐ Copy contents of banner-tokens.css
 *    ☐ Paste into src/design-system/tokens/component/notifications.css
 *    ☐ Keep existing ALERT and TOAST tokens
 *    ☐ Verify tokens are imported in your main CSS
 * 
 * 2. UPDATE BANNER COMPONENT:
 *    ☐ Replace Banner.tsx with Banner-simple.tsx
 *    ☐ Replace Banner.css with Banner-simple.css
 *    ☐ Keep Banner/index.ts unchanged
 * 
 * 3. UPDATE STEPWIZARD:
 *    ☐ Replace StepWizard.tsx with StepWizard-banner-fixed.tsx
 *    ☐ Verify imports are correct
 *    ☐ Test that banner is full-width and visible
 * 
 * 4. TEST:
 *    ☐ Banner shows at top of page
 *    ☐ Not hidden behind left panel
 *    ☐ Correct color based on availability
 *    ☐ Responsive on mobile
 *    ☐ Dark mode works
 *    ☐ Icon displays
 *    ☐ Loading animation works
 */

// ===============================================
// TROUBLESHOOTING
// ===============================================

/**
 * Banner hidden behind panel:
 * → Check banner-wrapper is outside step-wizard-layout
 * → Verify z-index doesn't apply to banner
 * → Make sure panel doesn't have overflow:visible on wrapper
 * 
 * Colors not applying:
 * → Check tokens are imported before Banner.css
 * → Verify --is-dark variable is set on [data-theme="dark"]
 * → Check color-mix() browser support
 * 
 * Icon not showing:
 * → Pass icon prop to AvailabilityBanner
 * → Use icon from @heroicons/react or StatusIcons
 * 
 * Responsive issues:
 * → Check viewport meta tag is set
 * → Media queries may need adjustment for your breakpoints
 * → Test on actual mobile devices, not just browser resize
 */

// ===============================================
// FUTURE ENHANCEMENTS
// ===============================================

/**
 * Optional improvements:
 * 
 * 1. DISMISSIBLE:
 *    - Add onClose prop to Banner
 *    - Show close button (X) on right
 *    - Remember dismissal in localStorage
 * 
 * 2. STICKY:
 *    - Use position: sticky
 *    - Banner stays visible when scrolling
 *    - Good for persistent availability info
 * 
 * 3. ANIMATION ENTRANCE:
 *    - Slide down from top
 *    - Fade in on load
 *    - Slide out when dismissed
 * 
 * 4. MULTIPLE BANNERS:
 *    - VStack multiple banners vertically
 *    - Priority system (error > warning > success)
 *    - Auto-dismiss after timeout
 * 
 * 5. COUNTDOWN:
 *    - Show time until offer expires
 *    - Real-time spot count updates
 *    - Refresh from API every N seconds
 */