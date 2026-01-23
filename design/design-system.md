src/design-system/
├── 📁 components/
│   ├── 📁 patterns/
│   │   ├── 📁 layout/
│   │   │   ├── index.ts
│   │   │   ├── Layout.tsx
│   │   │   ├── MainContent.tsx
│   │   │   └── sidebar.tsx
│   │   ├── 📁 navigation/
│   │   │   ├── index.ts
│   │   │   └── navigation.tsx
│   │   └── index.ts
│   ├── 📁 primitives/
│   │   ├── 📁 Button/
│   │   │   ├── Button.css
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── 📁 Card/
│   │   │   ├── Card.css
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── 📁 Input/
│   │   │   ├── index.ts
│   │   │   └── Input.tsx
│   │   └── index.ts
│   └── index.ts
├── 📁 themes/
│   ├── dark.css
│   ├── index.css
│   └── light.css
├── 📁 tokens/
│   ├── 📁 component/
│   │   ├── button.css
│   │   ├── card.css
│   │   ├── divider.css
│   │   ├── index.css
│   │   ├── input.css
│   │   ├── layout.css
│   │   ├── loading.css
│   │   ├── modal.css
│   │   ├── motion.css
│   │   ├── navigation.css
│   │   ├── table.css
│   │   ├── tabs.css
│   │   ├── tag.css
│   │   ├── toast-notification.css
│   │   ├── toast.css
│   │   └── zindex.css
│   ├── 📁 foundation/
│   │   ├── colors.css
│   │   ├── index.css
│   │   ├── motion.css
│   │   ├── radius.css
│   │   ├── shadows.css
│   │   ├── spacing.css
│   │   └── typography.css
│   ├── 📁 semantic/
│   │   ├── colors.css
│   │   ├── index.css
│   │   └── typography.css
│   └── index.css
├── 📁 utilities/
│   ├── components.css
│   ├── index.css
│   ├── layout.css
│   ├── responsive.css
│   ├── spacing.css
│   ├── text.css
│   └── typography.css
├── index.css
└── index.ts


will be 

# 🎯 Complete Design System Structure with Layout System

## 📁 Updated Folder Structure

```
im-dashboard/src/design-system/
├── 📁 components/
│   ├── 📁 primitives/                    # ✅ EXISTING - Basic building blocks
│   │   ├── 📁 Button/
│   │   │   ├── Button.tsx ✅
│   │   │   ├── Button.css ✅
│   │   │   └── index.ts ✅
│   │   ├── 📁 Card/
│   │   │   ├── Card.tsx ✅
│   │   │   ├── Card.css ✅
│   │   │   └── index.ts ✅
│   │   ├── 📁 Input/
│   │   │   ├── Input.tsx ✅
│   │   │   ├── Input.css ✅
│   │   │   └── index.ts ✅
│   │   ├── 📁 Textarea/ ✅
│   │   ├── 📁 Checkbox/ ✅
│   │   ├── 📁 Radio/ ✅
│   │   ├── 📁 Switch/ ✅
│   │   ├── 📁 Tag/ ✅
│   │   ├── 📁 Icon/ ✅
│   │   ├── 📁 IconButton/ ✅
│   │   ├── 📁 Typography/ ✅
│   │   ├── 📁 Tabs/ ✅
│   │   ├── 📁 Picker/ ✅
│   │   └── index.ts ✅
│   │
│   └── 📁 patterns/                      # ✅ EXISTING + NEW - Complex patterns
│       ├── 📁 layout/                    # 🔄 UPDATED - Layout system
│       │   ├── Layout.tsx ✅             # Your existing layout
│       │   ├── MainContent.tsx ✅        # Your existing content
│       │   ├── sidebar.tsx ✅            # Your existing sidebar
│       │   ├── StaticPageLayout.tsx 🆕   # Auth, paywall, landing
│       │   ├── StaticPageLayout.css 🆕
│       │   ├── AppLayout.tsx 🆕          # Dashboard, content pages
│       │   ├── AppLayout.css 🆕
│       │   ├── SettingsLayout.tsx 🆕     # Settings, profile pages
│       │   ├── SettingsLayout.css 🆕
│       │   ├── ModalLayout.tsx 🆕        # Dialogs, overlays
│       │   ├── ModalLayout.css 🆕
│       │   └── index.ts 🔄               # Updated exports
│       │
│       ├── 📁 auth/                      # 🆕 NEW - Auth-specific patterns
│       │   ├── AuthCard.tsx 🆕           # Login/register card
│       │   ├── AuthCard.css 🆕
│       │   ├── AuthForm.tsx 🆕           # Form with error handling
│       │   ├── AuthForm.css 🆕
│       │   ├── AuthField.tsx 🆕          # Label + input + validation
│       │   ├── AuthField.css 🆕
│       │   └── index.ts 🆕
│       │
│       ├── 📁 page/                      # 🔄 UPDATED - Page components
│       │   ├── pageHeader.tsx ✅         # Your existing header
│       │   ├── pageHeader.css ✅
│       │   ├── PageContent.tsx 🆕        # Scrollable content area
│       │   ├── PageContent.css 🆕
│       │   ├── Grid.tsx 🆕               # Responsive grid system
│       │   ├── Grid.css 🆕
│       │   ├── VStack.tsx 🆕              # Vertical spacing
│       │   ├── VStack.css 🆕
│       │   ├── HStack.tsx 🆕            # Horizontal grouping
│       │   ├── HStack.css 🆕
│       │   └── index.ts 🔄
│       │
│       ├── 📁 settings/                  # 🆕 NEW - Settings patterns
│       │   ├── SettingsSection.tsx 🆕    # Grouped form sections
│       │   ├── SettingsSection.css 🆕
│       │   ├── SettingsCard.tsx 🆕       # Individual setting blocks
│       │   ├── SettingsCard.css 🆕
│       │   ├── FormField.tsx 🆕          # Settings form fields
│       │   ├── FormField.css 🆕
│       │   ├── FormActions.tsx 🆕        # Save/cancel buttons
│       │   ├── FormActions.css 🆕
│       │   ├── DangerZone.tsx 🆕         # Destructive actions
│       │   ├── DangerZone.css 🆕
│       │   └── index.ts 🆕
│       │
│       ├── 📁 modal/                     # 🆕 NEW - Modal patterns
│       │   ├── ModalFooter.tsx 🆕        # Action buttons
│       │   ├── ModalFooter.css 🆕
│       │   ├── ConfirmationContent.tsx 🆕 # Delete confirmations
│       │   ├── ConfirmationContent.css 🆕
│       │   └── index.ts 🆕
│       │
│       ├── 📁 Header/ ✅                 # Your existing header
│       ├── 📁 navigation/ ✅             # Your existing navigation  
│       ├── 📁 EmptyState/ ✅             # Your existing empty state
│       └── index.ts 🔄                   # Updated to include all patterns
│
├── 📁 tokens/ ✅                         # Your existing tokens (perfect!)
├── 📁 themes/ ✅                         # Your existing themes
├── 📁 utilities/ ✅                      # Your existing utilities
├── design-system.md 🔄                   # Updated documentation
├── index.css 🔄                          # Updated imports
└── index.ts 🔄                          # Updated exports
```

## 🔄 Updated Files

### `/design-system/components/patterns/index.ts`
```typescript
// Layout patterns
export * from './layout';

// Auth patterns  
export * from './auth';

// Page patterns
export * from './page';

// Settings patterns
export * from './settings';

// Modal patterns
export * from './modal';

// Existing patterns
export * from './Header';
export * from './navigation';
export * from './EmptyState';
```

### `/design-system/components/patterns/layout/index.ts`
```typescript
// Existing layouts
export { Layout, MainContent } from './Layout';
export { default as Sidebar } from './sidebar';

// New layout system
export { StaticPageLayout, AuthLayout, PaywallLayout } from './StaticPageLayout';
export { AppLayout } from './AppLayout';
export { SettingsLayout } from './SettingsLayout';
export { ModalLayout } from './ModalLayout';
```

### `/design-system/index.css`
```css
/* Existing imports ✅ */
@import './tokens/foundation/index.css';
@import './tokens/semantic/index.css';
@import './tokens/component/index.css';
@import './utilities/index.css';

/* Existing primitive components ✅ */
@import './components/primitives/Button/Button.css';
@import './components/primitives/Card/Card.css';
@import './components/primitives/Input/Input.css';
/* ... all your existing primitive imports ... */

/* Existing pattern components ✅ */
@import './components/patterns/Header/Header.css';
@import './components/patterns/page/pageHeader.css';

/* NEW: Layout system imports 🆕 */
@import './components/patterns/layout/StaticPageLayout.css';
@import './components/patterns/layout/AppLayout.css';
@import './components/patterns/layout/SettingsLayout.css';
@import './components/patterns/layout/ModalLayout.css';

/* NEW: Auth pattern imports 🆕 */
@import './components/patterns/auth/AuthCard.css';
@import './components/patterns/auth/AuthForm.css';
@import './components/patterns/auth/AuthField.css';

/* NEW: Page pattern imports 🆕 */
@import './components/patterns/page/PageContent.css';
@import './components/patterns/page/Grid.css';
@import './components/patterns/page/VStack.css';
@import './components/patterns/page/HStack.css';

/* NEW: Settings pattern imports 🆕 */
@import './components/patterns/settings/SettingsSection.css';
@import './components/patterns/settings/SettingsCard.css';
@import './components/patterns/settings/FormField.css';
@import './components/patterns/settings/FormActions.css';
@import './components/patterns/settings/DangerZone.css';

/* NEW: Modal pattern imports 🆕 */
@import './components/patterns/modal/ModalFooter.css';
@import './components/patterns/modal/ConfirmationContent.css';
```

## 📂 Updated Project Structure

### `/layouts/` (Your existing layouts folder)
```
im-dashboard/src/layouts/
├── DashboardLayout.tsx ✅              # Keep as-is for now
└── README.md 🆕                        # Migration guide
```

**DashboardLayout.tsx** stays exactly the same for now! This is your migration safety net.

### `/pages/` (How your pages will evolve)
```
im-dashboard/src/pages/
├── login.tsx 🔄                        # Will use AuthLayout
├── profile.tsx 🔄                      # Will use SettingsLayout  
├── index.tsx ✅                        # Keep using DashboardLayout
├── website.tsx ✅                      # Keep using DashboardLayout
└── ... (all other pages stay the same)
```

## 🚀 Migration Strategy

### Phase 1: Add New Components (Week 1)
1. Create auth pattern components
2. Create layout components  
3. Test in isolation

### Phase 2: Convert Auth Pages (Week 2)
```typescript
// Old login.tsx
export default function Login() {
  return (
    <div className="min-h-screen flex items-center...">
      <div className="card">...</div>
    </div>
  );
}

// New login.tsx  
import { AuthLayout, AuthCard, AuthForm, AuthField } from '@/design-system';

export default function Login() {
  return (
    <AuthLayout>
      <AuthCard title="Login">
        <AuthForm>
          <AuthField label="Email"><Input /></AuthField>
          <AuthField label="Password"><Input /></AuthField>
          <Button>Sign In</Button>
        </AuthForm>
      </AuthCard>
    </AuthLayout>
  );
}
```

### Phase 3: Convert Settings Pages (Week 3)
Profile, billing, account pages → SettingsLayout

### Phase 4: Gradually Migrate Dashboard (Optional)
Your existing DashboardLayout can stay forever, or slowly migrate to AppLayout

## 🎯 Key Benefits of This Structure

### ✅ **Backwards Compatible**
- Your existing pages keep working
- No breaking changes
- Migrate at your own pace

### ✅ **Scalable Organization**  
- Clear separation: primitives vs patterns
- Logical grouping by use case
- Easy to find components

### ✅ **Maintainable**
- Each pattern owns its CSS
- Clear import structure
- Self-documenting code

### ✅ **Production Ready**
- Follows Shopify Polaris patterns
- Battle-tested structure
- Easy onboarding for new developers

This structure gives you the flexibility to migrate gradually while keeping everything organized and maintainable!