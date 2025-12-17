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
import { ComponentNode } from '../../../core/types/nodes';


// ===== MAIN SECTION BODY COMPONENT =====

interface SectionBodyProps {
  components?: Record<string, ComponentNode>;
  sectionKey?: string;
  patternKey?: string;
  type?: string;
  props?: Record<string, any>;
}

const SectionBody = ({ components = {}, sectionKey, patternKey }: SectionBodyProps) => {
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
        {renderIf('tag') && get('tag').props.content && (
          <Box>
            <Tag
              size="medium"
              variant='accent'
              icon={null}
              componentKey={get('tag').key}
            >
              {get('tag').props.content}
            </Tag>
          </Box>
        )}

        {/* Heading - only render if exists */}
        {renderIf('typography-heading') && get('typography-heading').props.content && (
          <Typography
            as="h2"
            variant="display-lg"
            color="heading"
            align="center"
            componentKey={get('typography-heading').key}
          >
            {get('typography-heading').props.content}
          </Typography>
        )}

        {/* Body Text - only render if exists */}
        {renderIf('typography-body') && get('typography-body').props.content && (
          <Typography
            as="p"
            variant="body-lg"
            color="body"
            weight="regular"
            align="center"
            componentKey={get('typography-body').key}
          >
            {get('typography-body').props.content}
          </Typography>
        )}

        {/* Button - only render if exists */}
        {renderIf('button-primary') && get('button-primary').props.content && (
          <Button
            size="lg"
            variant='accent'
            href={get('button-primary').props.href}
            componentKey={get('button-primary').key}
          >
            {get('button-primary').props.content}
          </Button>
        )}
      </VStack>
    </Box>
  );
};

SectionBody.displayName = 'SectionBody';

export default SectionBody;