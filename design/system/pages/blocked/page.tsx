/**
 * BlockedPage - System page for suspended/blocked websites
 * 
 * This page is automatically included in every build and served at /{locale}/blocked
 * It's used when a website is suspended due to payment issues, policy violations, etc.
 * 
 * @author Blimpify
 * @since 2024-12-24
 */
'use client';

import { VStack } from '../../components/layout/vStack/VStack';
import { Box } from '../../components/layout/box/Box';
import { Typography } from '../../components/Typography/Typography';
import { Tag } from '../../components/feedback/Tag/Tag';

// Import content statically (bundled at build time)
import svContent from './content/sv.json';
import enContent from './content/en.json';

const contentByLocale: Record<string, typeof svContent> = {
  sv: svContent,
  en: enContent,
};

export interface BlockedPageProps {
  locale?: string;
}

export function BlockedPage({ locale = 'sv' }: BlockedPageProps) {
  const content = contentByLocale[locale] || contentByLocale['sv'];

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-lg)',
      }}
    >
      <Box style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
        <VStack spacing="md" align="center">
          <Box>
            <Tag size="medium" variant="accent" icon={null}>
              {content.content.tag}
            </Tag>
          </Box>

          <Typography
            as="h1"
            variant="display-lg"
            color="heading"
            align="center"
          >
            {content.content.heading}
          </Typography>

          <Typography
            as="p"
            variant="body-lg"
            color="body"
            weight="regular"
            align="center"
          >
            {content.content.description}
          </Typography>
        </VStack>
      </Box>
    </Box>
  );
}

// Export content for external use
export { svContent, enContent, contentByLocale };
export default BlockedPage;
