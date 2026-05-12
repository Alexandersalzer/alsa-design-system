# Alsa UI Design System

A comprehensive React component library and design system for Alsa client websites.

## Installation

This is a private GitHub package. To install it, you need to configure npm to use the GitHub Package Registry.

### 1. Create or update your `.npmrc` file:

```
@blimpify-im:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

### 2. Install the package:

```bash
npm install @blimpify-im/ui
```

> The published npm package name is `@blimpify-im/ui` (the library is being rebranded to Alsa; the package name will follow in a future release).

## Usage

### Basic components

```tsx
import { Button, H1, Card } from '@blimpify-im/ui';

function MyComponent() {
  return (
    <Card>
      <H1>Welcome</H1>
      <Button variant="primary">Get Started</Button>
    </Card>
  );
}
```

### Layout components

```tsx
import { Container, VStack, Box } from '@blimpify-im/ui';

function MyLayout() {
  return (
    <Container>
      <VStack gap="lg">
        <Box>Item one</Box>
        <Box>Item two</Box>
      </VStack>
    </Container>
  );
}
```

### Navigation

```tsx
import { Nav } from '@blimpify-im/ui';

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <Nav.Root layout="sidebar" surface="page" currentPath={pathname} gap="lg">
      <Nav.Section label="Getting started">
        <Nav.List>
          <Nav.Item href="/intro">Intro</Nav.Item>
          <Nav.Item href="/setup">Setup</Nav.Item>
        </Nav.List>
      </Nav.Section>
    </Nav.Root>
  );
}
```

### Toasts

```tsx
import { ToastProvider, useToast } from '@blimpify-im/ui';

function App() {
  return (
    <ToastProvider>
      <MyComponent />
    </ToastProvider>
  );
}

function MyComponent() {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast({ type: 'success', message: 'Saved!' })}>
      Save
    </button>
  );
}
```

## Components

### Typography
H1–H6, Body, Label

### Actions
Button, IconButton, Clickable, TextLink, Nav, Tabs, SegmentedControl, SelectionCard, Kbd

### Forms
Input, Textarea, Picker, Checkbox, Radio, Switch, FileUploader, DatePicker, DateRangePicker, Slider

### Data display
Table, List, Listbox, ListboxItem

### Charts
Sparkline, LineChart, BarChart, AreaChart, DonutChart

### Layout
Container, VStack, HStack, Grid, Box, Card, Divider

### Overlays
Modal, Drawer, Popover, Menu, CommandMenu, Tooltip

### Feedback
Toast, Tag, Alert, Banner, Spinner, Progress, LoadingSkeleton, Badge

### Media
Image, Avatar, Logo, Icon

### Animations
CarouselAnimation, CountUp

### Navigation
Breadcrumbs, Pagination, LanguageSelector, BackButton, HashScrollHandler

### Shells
Navbar, Footer, PageBackground

### Patterns
Dashboard, GridPatterns, CookieConsent, EndingCta, AnimatedSurfaces, Cards, Host, Toast

## Development

```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build the package
npm run build
```

## License

MIT © Alsa
