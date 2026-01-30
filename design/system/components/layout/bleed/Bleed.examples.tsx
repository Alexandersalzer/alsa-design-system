// ===============================================
// Bleed Component - Usage Examples
// ===============================================

import React from 'react';
import { Bleed } from './Bleed';
import { Box } from '../box';
import { VStack } from '../vStack';
import { Card, CardContent, CardHeader } from '../Card';

/**
 * EXAMPLE 1: Basic Horizontal Bleed
 * Break out of container padding horizontally
 */
export const BasicHorizontalBleed = () => (
  <Box padding="xl" bg="card" border="default">
    <VStack spacing="md">
      <h3>Container with xl padding</h3>
      <Bleed inline="xl">
        <img
          src="/hero.jpg"
          alt="Full width hero"
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
      </Bleed>
      <p>Content below the bleed image</p>
    </VStack>
  </Box>
);

/**
 * EXAMPLE 2: Vertical Bleed (Block Direction)
 * Break out at the top and bottom
 */
export const VerticalBleed = () => (
  <Box padding="2xl" bg="card">
    <Bleed block="2xl">
      <div style={{
        background: 'linear-gradient(to bottom, #667eea 0%, #764ba2 100%)',
        padding: '3rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2>Full bleed background</h2>
        <p>This breaks out top and bottom</p>
      </div>
    </Bleed>
  </Box>
);

/**
 * EXAMPLE 3: Asymmetric Bleed
 * Break out only on specific sides
 */
export const AsymmetricBleed = () => (
  <Box padding="lg" bg="card" border="default">
    <VStack spacing="lg">
      <h3>Left-aligned content</h3>

      {/* Bleed only on the left side */}
      <Bleed inlineStart="lg">
        <div style={{
          background: '#f3f4f6',
          padding: '1rem',
          borderLeft: '4px solid #3b82f6'
        }}>
          This breaks out to the left only
        </div>
      </Bleed>

      {/* Bleed only on the right side */}
      <Bleed inlineEnd="lg">
        <div style={{
          background: '#f3f4f6',
          padding: '1rem',
          borderRight: '4px solid #10b981'
        }}>
          This breaks out to the right only
        </div>
      </Bleed>
    </VStack>
  </Box>
);

/**
 * EXAMPLE 4: Top-Only Bleed (Hero Pattern)
 * Common pattern for hero sections
 */
export const HeroPatternBleed = () => (
  <Box padding="2xl" bg="card">
    <VStack spacing="xl">
      <Bleed blockStart="2xl">
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '4rem 2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '3rem' }}>Hero Section</h1>
          <p style={{ margin: '1rem 0 0', fontSize: '1.25rem' }}>
            This bleeds to the top edge
          </p>
        </div>
      </Bleed>

      <div>
        <h2>Content Section</h2>
        <p>Regular content with padding maintained</p>
      </div>
    </VStack>
  </Box>
);

/**
 * EXAMPLE 5: Card with Bleed Image
 * Using asChild for composition without wrapper div
 */
export const CardWithBleedImage = () => (
  <Card padding="md" variant="outlined" style={{ maxWidth: '400px' }}>
    <VStack spacing="md">
      <CardHeader>
        <h3 style={{ margin: 0 }}>Product Card</h3>
      </CardHeader>

      {/* Image bleeds out of card padding */}
      <Bleed inline="md" asChild>
        <img
          src="/product.jpg"
          alt="Product"
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '4px'
          }}
        />
      </Bleed>

      <CardContent>
        <p>Product description goes here</p>
        <button>Add to Cart</button>
      </CardContent>
    </VStack>
  </Card>
);

/**
 * EXAMPLE 6: Full Bleed Background
 * Bleed in all directions
 */
export const FullBleedBackground = () => (
  <Box padding="2xl" bg="card" border="default">
    <Bleed inline="2xl" block="2xl">
      <div style={{
        background: 'url(/pattern.svg)',
        backgroundSize: 'cover',
        padding: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '500px'
        }}>
          <h2 style={{ margin: '0 0 1rem' }}>Centered Content</h2>
          <p>Background bleeds to all edges</p>
        </div>
      </div>
    </Bleed>
  </Box>
);

/**
 * EXAMPLE 7: Using Design Tokens
 * Demonstrating different spacing scales
 */
export const WithDesignTokens = () => (
  <VStack spacing="xl">
    <Box padding="sm" bg="card" border="default">
      <Bleed inline="sm">
        <div style={{ background: '#fee', padding: '1rem' }}>
          Small bleed (sm token)
        </div>
      </Bleed>
    </Box>

    <Box padding="md" bg="card" border="default">
      <Bleed inline="md">
        <div style={{ background: '#efe', padding: '1rem' }}>
          Medium bleed (md token)
        </div>
      </Bleed>
    </Box>

    <Box padding="lg" bg="card" border="default">
      <Bleed inline="lg">
        <div style={{ background: '#eef', padding: '1rem' }}>
          Large bleed (lg token)
        </div>
      </Bleed>
    </Box>

    <Box padding="xl" bg="card" border="default">
      <Bleed inline="xl">
        <div style={{ background: '#ffe', padding: '1rem' }}>
          Extra large bleed (xl token)
        </div>
      </Bleed>
    </Box>
  </VStack>
);

/**
 * EXAMPLE 8: Using Numeric Values
 * Direct pixel values when needed
 */
export const WithNumericValues = () => (
  <Box padding="lg" bg="card" border="default">
    <Bleed inline={24} block={16}>
      <div style={{
        background: '#f0f9ff',
        padding: '2rem',
        border: '2px dashed #3b82f6'
      }}>
        Bleed with exact pixel values: 24px horizontal, 16px vertical
      </div>
    </Bleed>
  </Box>
);

/**
 * EXAMPLE 9: Polymorphic Component
 * Rendering as different HTML elements
 */
export const PolymorphicBleed = () => (
  <Box padding="xl" bg="card">
    <VStack spacing="lg">
      {/* Render as article */}
      <Bleed as="article" blockStart="xl">
        <article style={{ background: '#f9fafb', padding: '2rem' }}>
          <h2>Article Element</h2>
          <p>This Bleed component renders as an article tag</p>
        </article>
      </Bleed>

      {/* Render as section */}
      <Bleed as="section" inline="xl">
        <section style={{ background: '#fef2f2', padding: '2rem' }}>
          <h2>Section Element</h2>
          <p>This Bleed component renders as a section tag</p>
        </section>
      </Bleed>
    </VStack>
  </Box>
);

/**
 * EXAMPLE 10: Complex Layout Pattern
 * Combining multiple bleeds in a realistic layout
 */
export const ComplexLayoutPattern = () => (
  <Box padding="2xl" bg="card">
    <VStack spacing="2xl">
      {/* Hero image bleeds to top and sides */}
      <Bleed inline="2xl" blockStart="2xl">
        <div style={{
          background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>Welcome</h1>
        </div>
      </Bleed>

      {/* Content with normal padding */}
      <div>
        <h2>About Us</h2>
        <p>This content respects the container padding</p>
      </div>

      {/* Feature cards bleed horizontally */}
      <Bleed inline="2xl">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          padding: '0 2rem'
        }}>
          {[1, 2, 3, 4].map(i => (
            <Card key={i} variant="outlined">
              <CardContent>
                <h3>Feature {i}</h3>
                <p>Description here</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Bleed>

      {/* Footer bleeds to bottom and sides */}
      <Bleed inline="2xl" blockEnd="2xl">
        <footer style={{
          background: '#1f2937',
          color: 'white',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <p>&copy; 2024 Company Name</p>
        </footer>
      </Bleed>
    </VStack>
  </Box>
);

/**
 * EXAMPLE 11: Responsive Bleed
 * Using container-responsive spacing tokens
 */
export const ResponsiveBleed = () => (
  <Box
    padding="md"  // This is responsive (different at mobile/tablet/desktop)
    bg="card"
    border="default"
  >
    <Bleed inline="md">  {/* Matches container padding at all breakpoints */}
      <div style={{
        background: '#f3f4f6',
        padding: 'var(--foundation-space-6)',
        borderTop: '3px solid #8b5cf6',
        borderBottom: '3px solid #8b5cf6'
      }}>
        This bleed is responsive - it adapts to match the container padding
        at different screen sizes
      </div>
    </Bleed>
  </Box>
);

/**
 * EXAMPLE 12: AsChild with Custom Components
 * Using asChild to avoid wrapper divs
 */
export const AsChildPattern = () => {
  const CustomImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
    (props, ref) => (
      <img
        ref={ref}
        {...props}
        style={{
          ...props.style,
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      />
    )
  );
  CustomImage.displayName = 'CustomImage';

  return (
    <Card padding="lg">
      <VStack spacing="md">
        <h3>Gallery Card</h3>

        {/* No wrapper div - bleeds applied directly to CustomImage */}
        <Bleed inline="lg" blockEnd="lg" asChild>
          <CustomImage
            src="/gallery.jpg"
            alt="Gallery"
            style={{ width: '100%', height: '250px', objectFit: 'cover' }}
          />
        </Bleed>
      </VStack>
    </Card>
  );
};

/**
 * Demo Container - Shows all examples
 */
export const BleedExamples = () => (
  <VStack spacing="2xl" style={{ padding: '2rem', background: '#f9fafb' }}>
    <h1>Bleed Component Examples</h1>

    <div>
      <h2>1. Basic Horizontal Bleed</h2>
      <BasicHorizontalBleed />
    </div>

    <div>
      <h2>2. Vertical Bleed</h2>
      <VerticalBleed />
    </div>

    <div>
      <h2>3. Asymmetric Bleed</h2>
      <AsymmetricBleed />
    </div>

    <div>
      <h2>4. Hero Pattern</h2>
      <HeroPatternBleed />
    </div>

    <div>
      <h2>5. Card with Bleed Image</h2>
      <CardWithBleedImage />
    </div>

    <div>
      <h2>6. Full Bleed Background</h2>
      <FullBleedBackground />
    </div>

    <div>
      <h2>7. Design Tokens</h2>
      <WithDesignTokens />
    </div>

    <div>
      <h2>8. Numeric Values</h2>
      <WithNumericValues />
    </div>

    <div>
      <h2>9. Polymorphic Component</h2>
      <PolymorphicBleed />
    </div>

    <div>
      <h2>10. Complex Layout</h2>
      <ComplexLayoutPattern />
    </div>

    <div>
      <h2>11. Responsive Bleed</h2>
      <ResponsiveBleed />
    </div>

    <div>
      <h2>12. AsChild Pattern</h2>
      <AsChildPattern />
    </div>
  </VStack>
);

export default BleedExamples;
