"use client";

import React from 'react';
import { Box, Body, CarouselAnimation, VStack, Image } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function CarouselAnimationPage() {
  const basicSlides = [
    {
      id: 1,
      content: (
        <Box display="flex" justify="center" align="center" style={{ height: '70px', background: 'var(--bg-accent-subtle)', borderRadius: '8px' }}>
          <Body size="lg" weight="bold">Slide 1</Body>
        </Box>
      ),
    },
    {
      id: 2,
      content: (
        <Box display="flex" justify="center" align="center" style={{ height: '70px', background: 'var(--bg-accent-subtle)', borderRadius: '8px' }}>
          <Body size="lg" weight="bold">Slide 2</Body>
        </Box>
      ),
    },
    {
      id: 3,
      content: (
        <Box display="flex" justify="center" align="center" style={{ height: '70px', background: 'var(--bg-accent-subtle)', borderRadius: '8px' }}>
          <Body size="lg" weight="bold">Slide 3</Body>
        </Box>
      ),
    },
  ];

  const featureSlides = [
    {
      id: 1,
      content: (
        <Box display="flex" justify="center" align="center" style={{ height: '70px', background: 'var(--bg-primary-subtle)', borderRadius: '8px' }}>
          <Body size="md" weight="medium">Fast Performance</Body>
        </Box>
      ),
    },
    {
      id: 2,
      content: (
        <Box display="flex" justify="center" align="center" style={{ height: '70px', background: 'var(--bg-primary-subtle)', borderRadius: '8px' }}>
          <Body size="md" weight="medium">Secure Data</Body>
        </Box>
      ),
    },
    {
      id: 3,
      content: (
        <Box display="flex" justify="center" align="center" style={{ height: '70px', background: 'var(--bg-primary-subtle)', borderRadius: '8px' }}>
          <Body size="md" weight="medium">Easy Integration</Body>
        </Box>
      ),
    },
    {
      id: 4,
      content: (
        <Box display="flex" justify="center" align="center" style={{ height: '70px', background: 'var(--bg-primary-subtle)', borderRadius: '8px' }}>
          <Body size="md" weight="medium">24/7 Support</Body>
        </Box>
      ),
    },
  ];

  const teamMembers = [
    {
      id: 1,
      content: (
        <VStack spacing="sm" align="center">
          <Box style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--border-accent)' }}>
            <Image src="https://i.pravatar.cc/150?img=1" alt="Sarah Johnson" width={80} height={80} style={{ objectFit: 'cover' }} />
          </Box>
          <Body size="sm" weight="semibold">Sarah Johnson</Body>
          <Body size="xs" color="secondary">CEO</Body>
        </VStack>
      ),
    },
    {
      id: 2,
      content: (
        <VStack spacing="sm" align="center">
          <Box style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--border-accent)' }}>
            <Image src="https://i.pravatar.cc/150?img=2" alt="Michael Chen" width={80} height={80} style={{ objectFit: 'cover' }} />
          </Box>
          <Body size="sm" weight="semibold">Michael Chen</Body>
          <Body size="xs" color="secondary">CTO</Body>
        </VStack>
      ),
    },
    {
      id: 3,
      content: (
        <VStack spacing="sm" align="center">
          <Box style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--border-accent)' }}>
            <Image src="https://i.pravatar.cc/150?img=3" alt="Emily Rodriguez" width={80} height={80} style={{ objectFit: 'cover' }} />
          </Box>
          <Body size="sm" weight="semibold">Emily Rodriguez</Body>
          <Body size="xs" color="secondary">Designer</Body>
        </VStack>
      ),
    },
    {
      id: 4,
      content: (
        <VStack spacing="sm" align="center">
          <Box style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--border-accent)' }}>
            <Image src="https://i.pravatar.cc/150?img=4" alt="David Kim" width={80} height={80} style={{ objectFit: 'cover' }} />
          </Box>
          <Body size="sm" weight="semibold">David Kim</Body>
          <Body size="xs" color="secondary">Developer</Body>
        </VStack>
      ),
    },
  ];

  return (
    <ComponentDocPage
      componentName="CarouselAnimation"
      description="Infinite horizontal scrolling carousel animation for showcasing logos, features, team members, testimonials, or repeating content"
      importStatement={`import { CarouselAnimation } from '../../../design/index';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple infinite scrolling carousel',
          preview: (
            <CarouselAnimation
              items={basicSlides}
              speed={20}
              itemWidth="200px"
              itemHeight="70px"
              gap="30px"
            />
          ),
          code: `import { CarouselAnimation, Box, Body } from '../../../design/index';

const items = [
  {
    id: 1,
    content: (
      <Box display="flex" justify="center" align="center">
        <Body>Slide 1</Body>
      </Box>
    ),
  },
  {
    id: 2,
    content: (
      <Box display="flex" justify="center" align="center">
        <Body>Slide 2</Body>
      </Box>
    ),
  },
  {
    id: 3,
    content: (
      <Box display="flex" justify="center" align="center">
        <Body>Slide 3</Body>
      </Box>
    ),
  },
];

export function BasicCarouselAnimation() {
  return (
    <CarouselAnimation
      items={items}
      speed={20}
      itemWidth="200px"
      itemHeight="70px"
      gap="30px"
    />
  );
}`,
        },

        {
          title: 'Direction',
          description: 'Control the scroll direction with left or right',
          preview: (
            <VStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="sm" align="stretch">
                <Body size="xs" color="secondary" weight="semibold">Left Direction</Body>
                <CarouselAnimation
                  items={featureSlides}
                  direction="left"
                  speed={25}
                  itemWidth="180px"
                  itemHeight="70px"
                  gap="20px"
                />
              </VStack>

              <VStack spacing="sm" align="stretch">
                <Body size="xs" color="secondary" weight="semibold">Right Direction</Body>
                <CarouselAnimation
                  items={featureSlides}
                  direction="right"
                  speed={25}
                  itemWidth="180px"
                  itemHeight="70px"
                  gap="20px"
                />
              </VStack>
            </VStack>
          ),
          code: `import { CarouselAnimation } from '../../../design/index';

export function CarouselDirection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CarouselAnimation
        items={items}
        direction="left"
        speed={25}
      />

      <CarouselAnimation
        items={items}
        direction="right"
        speed={25}
      />
    </div>
  );
}`,
        },

        {
          title: 'Speed Control',
          description: 'Adjust animation speed. Higher values create slower movement',
          preview: (
            <VStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="sm" align="stretch">
                <Body size="xs" color="secondary" weight="semibold">Fast: speed=15</Body>
                <CarouselAnimation
                  items={basicSlides}
                  speed={15}
                  itemWidth="150px"
                  itemHeight="60px"
                  gap="25px"
                />
              </VStack>

              <VStack spacing="sm" align="stretch">
                <Body size="xs" color="secondary" weight="semibold">Medium: speed=30</Body>
                <CarouselAnimation
                  items={basicSlides}
                  speed={30}
                  itemWidth="150px"
                  itemHeight="60px"
                  gap="25px"
                />
              </VStack>

              <VStack spacing="sm" align="stretch">
                <Body size="xs" color="secondary" weight="semibold">Slow: speed=50</Body>
                <CarouselAnimation
                  items={basicSlides}
                  speed={50}
                  itemWidth="150px"
                  itemHeight="60px"
                  gap="25px"
                />
              </VStack>
            </VStack>
          ),
          code: `import { CarouselAnimation } from '../../../design/index';

export function CarouselSpeedControl() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CarouselAnimation items={items} speed={15} />
      <CarouselAnimation items={items} speed={30} />
      <CarouselAnimation items={items} speed={50} />
    </div>
  );
}`,
        },

        {
          title: 'With Images',
          description: 'Carousel with image-based content, useful for team members or testimonials',
          preview: (
            <CarouselAnimation
              items={teamMembers}
              speed={35}
              itemWidth="140px"
              itemHeight="160px"
              gap="40px"
            />
          ),
          code: `import { CarouselAnimation, Image, VStack, Box, Body } from '../../../design/index';

const teamMembers = [
  {
    id: 1,
    content: (
      <VStack spacing="sm" align="center">
        <Box style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden' }}>
          <Image
            src="https://i.pravatar.cc/150?img=1"
            alt="Sarah Johnson"
            width={80}
            height={80}
            style={{ objectFit: 'cover' }}
          />
        </Box>
        <Body size="sm" weight="semibold">Sarah Johnson</Body>
        <Body size="xs" color="secondary">CEO</Body>
      </VStack>
    ),
  },
];

export function ImageCarouselAnimation() {
  return (
    <CarouselAnimation
      items={teamMembers}
      speed={35}
      itemWidth="140px"
      itemHeight="160px"
      gap="40px"
    />
  );
}`,
        },

        {
          title: 'Fade Edges',
          description: 'Enable or disable fade masks at the carousel edges',
          preview: (
            <VStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="sm" align="stretch">
                <Body size="xs" color="secondary" weight="semibold">With Fade Edges</Body>
                <CarouselAnimation
                  items={featureSlides}
                  speed={25}
                  itemWidth="180px"
                  itemHeight="70px"
                  gap="20px"
                  enableFadeEdges={true}
                />
              </VStack>

              <VStack spacing="sm" align="stretch">
                <Body size="xs" color="secondary" weight="semibold">Without Fade Edges</Body>
                <CarouselAnimation
                  items={featureSlides}
                  speed={25}
                  itemWidth="180px"
                  itemHeight="70px"
                  gap="20px"
                  enableFadeEdges={false}
                />
              </VStack>
            </VStack>
          ),
          code: `import { CarouselAnimation } from '../../../design/index';

export function CarouselFadeEdges() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CarouselAnimation
        items={items}
        enableFadeEdges={true}
      />

      <CarouselAnimation
        items={items}
        enableFadeEdges={false}
      />
    </div>
  );
}`,
        },

        {
          title: 'Customization',
          description: 'Customize sizing, spacing, height, padding, and fade width',
          preview: (
            <CarouselAnimation
              items={[
                {
                  id: 1,
                  content: (
                    <Box display="flex" justify="center" align="center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', height: '100%', width: '100%' }}>
                      <Body size="md" weight="bold" style={{ color: 'white' }}>Custom 1</Body>
                    </Box>
                  ),
                },
                {
                  id: 2,
                  content: (
                    <Box display="flex" justify="center" align="center" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '12px', height: '100%', width: '100%' }}>
                      <Body size="md" weight="bold" style={{ color: 'white' }}>Custom 2</Body>
                    </Box>
                  ),
                },
                {
                  id: 3,
                  content: (
                    <Box display="flex" justify="center" align="center" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '12px', height: '100%', width: '100%' }}>
                      <Body size="md" weight="bold" style={{ color: 'white' }}>Custom 3</Body>
                    </Box>
                  ),
                },
              ]}
              speed={22}
              itemWidth="220px"
              itemHeight="100px"
              gap="35px"
              containerHeight="120px"
              padding="10px"
              fadeWidth="150px"
            />
          ),
          code: `import { CarouselAnimation } from '../../../design/index';

export function CustomizedCarouselAnimation() {
  return (
    <CarouselAnimation
      items={customItems}
      speed={22}
      itemWidth="220px"
      itemHeight="100px"
      gap="35px"
      containerHeight="120px"
      padding="10px"
      fadeWidth="150px"
    />
  );
}`,
        },

        {
          title: 'Practical Example',
          description: 'Logo showcase carousel for landing pages',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Body size="sm" color="secondary" align="center">
                Trusted by leading companies
              </Body>

              <CarouselAnimation
                items={[
                  {
                    id: 1,
                    content: (
                      <Box display="flex" justify="center" align="center" style={{ height: '50px' }}>
                        <Body size="lg" weight="bold" color="secondary">ACME Corp</Body>
                      </Box>
                    ),
                  },
                  {
                    id: 2,
                    content: (
                      <Box display="flex" justify="center" align="center" style={{ height: '50px' }}>
                        <Body size="lg" weight="bold" color="secondary">TechStart</Body>
                      </Box>
                    ),
                  },
                  {
                    id: 3,
                    content: (
                      <Box display="flex" justify="center" align="center" style={{ height: '50px' }}>
                        <Body size="lg" weight="bold" color="secondary">DataFlow</Body>
                      </Box>
                    ),
                  },
                  {
                    id: 4,
                    content: (
                      <Box display="flex" justify="center" align="center" style={{ height: '50px' }}>
                        <Body size="lg" weight="bold" color="secondary">CloudNet</Body>
                      </Box>
                    ),
                  },
                  {
                    id: 5,
                    content: (
                      <Box display="flex" justify="center" align="center" style={{ height: '50px' }}>
                        <Body size="lg" weight="bold" color="secondary">SecureBase</Body>
                      </Box>
                    ),
                  },
                ]}
                speed={28}
                itemWidth="160px"
                itemHeight="50px"
                gap="50px"
              />
            </VStack>
          ),
          code: `import { CarouselAnimation } from '../../../design/index';

const logos = [
  { id: 1, content: <img src="/logo1.png" alt="Company 1" /> },
  { id: 2, content: <img src="/logo2.png" alt="Company 2" /> },
  { id: 3, content: <img src="/logo3.png" alt="Company 3" /> },
];

export function LogoCarouselAnimation() {
  return (
    <CarouselAnimation
      items={logos}
      speed={28}
      itemWidth="160px"
      itemHeight="50px"
      gap="50px"
    />
  );
}`,
        },
      ]}
      properties={[
        { name: 'items', type: '{ id: string | number; content: ReactNode }[]', description: 'Carousel items. Each item needs an id and content' },
        { name: 'speed', type: 'number', default: '30', description: 'Animation speed. Higher values move slower' },
        { name: 'direction', type: "'left' | 'right'", default: "'left'", description: 'Scroll direction' },
        { name: 'itemWidth', type: 'string', description: 'Width of each carousel item' },
        { name: 'itemHeight', type: 'string', description: 'Height of each carousel item' },
        { name: 'gap', type: 'string', description: 'Spacing between carousel items' },
        { name: 'containerHeight', type: 'string', description: 'Height of the carousel container' },
        { name: 'padding', type: 'string', description: 'Inner padding around the carousel track' },
        { name: 'fadeWidth', type: 'string', description: 'Width of the fade mask at each edge' },
        { name: 'enableFadeEdges', type: 'boolean', default: 'true', description: 'Enable or disable fade masks at the edges' },
      ]}
    />
  );
}