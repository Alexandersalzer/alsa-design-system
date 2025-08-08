'use client';

import { Section } from '../../../../../system/layout/frames/section';
import { Container } from '../../../../../system/layout/frames/container';
import KjFooter from '../../../../../system/components/patterns/client/kj-footer/kj-footer';
import { useEditingMode } from '../../../../../cms/wrappers/editing/EditingWrapper';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';

const Footer = () => {
  const { isEditingMode } = useEditingMode();
  const { getGlobalComponent, getTemplateBlocks, getBlockContent } = useContent();
  
  // Get footer global component using generic function
  const footerComponent = getGlobalComponent('footer');
  
  // Get blocks from footer pattern
  const footerBlocks = getTemplateBlocks(footerComponent, 'footer');
  
  // Get content from CMS blocks
  const footerContent = {
    companyName: getBlockContent(footerBlocks, 'companyName'),
    email: getBlockContent(footerBlocks, 'email'),
    copyright: getBlockContent(footerBlocks, 'copyright'),
    credits: getBlockContent(footerBlocks, 'credits'),
    creditsLink: getBlockContent(footerBlocks, 'creditsLink')
  };
  
  return (
    <Section 
      as="footer" 
      style={{ 
        backgroundColor: 'var(--primary-1200)',
        overflow: 'visible', // Allow dropdown to show outside footer bounds
        paddingTop: 'var(--foundation-space-16, 4rem)',
        paddingBottom: 'var(--foundation-space-16, 4rem)'
      }}
    >
      <Container align="center">
        <KjFooter 
          isEditingMode={isEditingMode} 
          content={footerContent}
        />
      </Container>
    </Section>
  );
};

export default Footer; 