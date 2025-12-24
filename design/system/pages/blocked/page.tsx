/**
 * BlockedPage - System page for suspended/blocked websites
 * 
 * This page is automatically included in every build and served at /system/blocked
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

export interface BlockedPageProps {
  tagText?: string;
  heading?: string;
  description?: string;
}

export function BlockedPage({
  tagText = 'Tillfälligt otillgänglig',
  heading = 'Webbplatsen är inte tillgänglig',
  description = 'Denna webbplats är för närvarande inte tillgänglig. Om du är ägaren till webbplatsen, vänligen kontakta support för mer information.',
}: BlockedPageProps) {
  return (
    <html lang="sv">
      <head>
        <title>Webbplatsen är inte tillgänglig</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          :root {
            --space-xs: 0.25rem;
            --space-sm: 0.5rem;
            --space-md: 1rem;
            --space-lg: 2rem;
            --space-xl: 3rem;
            --radius-md: 0.5rem;
            --radius-full: 9999px;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #fafafa;
            color: #1a1a1a;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
          }
        `}</style>
      </head>
      <body>
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
                  {tagText}
                </Tag>
              </Box>

              <Typography
                as="h1"
                variant="display-lg"
                color="heading"
                align="center"
              >
                {heading}
              </Typography>

              <Typography
                as="p"
                variant="body-lg"
                color="body"
                weight="regular"
                align="center"
              >
                {description}
              </Typography>
            </VStack>
          </Box>
        </Box>
      </body>
    </html>
  );
}

export const blockedMetadata = {
  title: 'Webbplatsen är inte tillgänglig',
  robots: 'noindex, nofollow',
};

export default BlockedPage;
