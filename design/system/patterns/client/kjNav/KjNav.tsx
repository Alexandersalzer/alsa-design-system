'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Typography } from '../../../components';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Box } from '../../../components/layout/box/Box';

interface KjNavProps {
  components?: Record<string, {
    type: string;
    content: string | any;
  }>;
}

const KjNav = ({ components = {} }: KjNavProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<string>('sv');

  // Extract content from components
  const componentsList = Object.values(components);
  const logoComponent = componentsList.find(c => c.type === 'logo');
  const titleComponent = componentsList.find(c => c.type === 'title');
  const navItems = componentsList.filter(c => c.type === 'navItem');

  // Extract current locale from pathname
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const locale = pathSegments[0];
    if (locale === 'sv' || locale === 'en') {
      setCurrentLocale(locale);
    }
  }, [pathname]);

  const handleNavigation = (content: string, isLast: boolean) => {
    // Simple navigation logic - convert content to slug
    const slug = content.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/å/g, 'a')
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o');
    
    if (isLast) {
      // Last item is usually a contact button
      router.push(`/${currentLocale}/kontakt`);
    } else {
      router.push(`/${currentLocale}/${slug}`);
    }
  };

  const handleBrandClick = () => {
    router.push(`/${currentLocale}/hem`);
  };

  return (
    <Box style={{ width: '100%' }}>
      <HStack justify="between" align="center" spacing="md">
        {/* Brand with Logo */}
        <Box 
          onClick={handleBrandClick}
          style={{ cursor: 'pointer' }}
        >
          <HStack spacing="sm" align="center">
            {logoComponent && (
              <img 
                src={logoComponent.content.src || '/images/sections/kjlogo.png'}
                alt={logoComponent.content.alt || 'Logo'}
                width={32}
                height={32}
                className="object-contain flex-shrink-0"
              />
            )}
            <Typography 
              variant="h5" 
              color="primary" 
              weight="bold"
            >
              {titleComponent?.content || 'MARKETING SWEDEN'}
            </Typography>
          </HStack>
        </Box>

        {/* Navigation Items */}
        <HStack spacing="lg" align="center">
          {navItems.map((item, index) => {
            const isLast = index === navItems.length - 1;
            
            return (
              <Typography
                key={index}
                variant="body-md"
                color={isLast ? "accent" : "primary"}
                weight="medium"
                style={{ 
                  cursor: 'pointer',
                  padding: isLast ? '8px 16px' : '8px',
                  backgroundColor: isLast ? 'var(--accent-600)' : 'transparent',
                  color: isLast ? 'white' : 'inherit',
                  borderRadius: isLast ? '4px' : '0',
                  textDecoration: 'none'
                }}
                onClick={() => handleNavigation(item.content, isLast)}
                onMouseEnter={(e) => {
                  if (!isLast) {
                    e.currentTarget.style.textDecoration = 'underline';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLast) {
                    e.currentTarget.style.textDecoration = 'none';
                  }
                }}
              >
                {item.content}
              </Typography>
            );
          })}
        </HStack>
      </HStack>
    </Box>
  );
};

export default KjNav;