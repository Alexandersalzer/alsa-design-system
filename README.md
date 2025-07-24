# Blimpify UI Design System

A comprehensive React component library and design system for Blimpify client websites.

## Installation

This is a private GitHub package. To install it, you need to configure npm to use GitHub Package Registry.

### 1. Create or update your `.npmrc` file:

```
@blimpify-im:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

### 2. Install the package:

```bash
npm install @blimpify-im/ui
```

## Usage

### Basic Components

```tsx
import { Button, Typography, Card } from '@blimpify-im/ui';

function MyComponent() {
  return (
    <Card>
      <Typography variant="h1">Welcome</Typography>
      <Button variant="primary">Get Started</Button>
    </Card>
  );
}
```

### Layout Components

```tsx
import { Container, Section, Stack } from '@blimpify-im/ui';

function MyLayout() {
  return (
    <Section>
      <Container>
        <Stack space="lg">
          <h1>My Content</h1>
          <p>Some text content</p>
        </Stack>
      </Container>
    </Section>
  );
}
```

### CMS Integration

```tsx
import { ContentProvider, useContent } from '@blimpify-im/ui';

function App() {
  return (
    <ContentProvider>
      <MyComponent />
    </ContentProvider>
  );
}

function MyComponent() {
  const { content, isLoading } = useContent();
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{/* Your content here */}</div>;
}
```

## Components

### Primitives
- Button
- Input
- Textarea
- Checkbox
- Radio
- Switch
- Dropdown
- Modal
- Toast
- Card
- Tag
- Typography
- Icon
- IconButton

### Layout
- Container
- Section
- Block
- Stack
- Cluster
- Grid
- Rhythm

### Patterns
- Navigation
- Footer
- RichText
- Loading States

### Templates
- Hero Section
- About Section
- Navbar
- Footer

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

MIT © Blimpify 