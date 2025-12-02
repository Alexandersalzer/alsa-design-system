// ===============================================
// LOCATION: design/system/components/patterns/content-blocks/SectionBody/SectionBody.tsx
// SectionBody - NO CSS FILE NEEDED - Uses existing layout components
// ===============================================
'use client';

import { VStack } from '../../../components/layout/vStack/VStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../components/Typography/Typography';
import { Tag } from '../../../components/feedback/Tag/Tag';
import { Button } from '../../../components/actions/Button/Button';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { PatternNode } from '../../../core/types/nodes';


// ===== MAIN SECTION BODY COMPONENT =====

const SectionBody = ({ components = {} }: PatternNode) => {
  const get = componentProps(components);
  const renderIf = componentPresent(components);
  
  return (
    <Box
      style={{
        maxWidth: '650px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <VStack spacing="md" align="center">
        
        {/* Tag - only render if exists */}
        {renderIf('tag') && get('tag').content && (
          <Box>
            <Tag
              size="medium"
              icon={null}
            >
              {get('tag').content}
            </Tag>
          </Box>
        )}

        {/* Heading - only render if exists */}
        {renderIf('typography-heading') && get('typography-heading').content && (
          <Typography
            as="h2"
            variant="display-lg"
            color="heading"
            weight="bold"
            align="center"
          >
            {get('typography-heading').content}
          </Typography>
        )}

        {/* Body Text - only render if exists */}
        {renderIf('typography-body') && get('typography-body').content && (
          <Typography
            as="p"
            variant="body-lg"
            color="body"
            weight="regular"
            align="center"
          >
            {get('typography-body').content}
          </Typography>
        )}

        {/* Button - only render if exists */}
        {renderIf('button-primary') && get('button-primary').content && (
          <Button
            size="lg"
          >
            {get('button-primary').content}
          </Button>
        )}
      </VStack>
    </Box>
  );
};

SectionBody.displayName = 'SectionBody';

export default SectionBody;