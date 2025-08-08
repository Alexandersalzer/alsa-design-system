'use client';

import { Section } from '../../../../../system/layout/frames/section';
import { Container } from '../../../../../system/layout/frames/container';
import KjFooter from '../../../../../system/components/patterns/client/kj-footer/kj-footer';
import { useEditingMode } from '../../../../../cms/wrappers/editing/EditingWrapper';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';

console.log('🌐 [FOOTER] FILE LOADED - Footer.tsx is being executed');

const Footer = () => {
  console.log('🌐 [FOOTER] COMPONENT CONSTRUCTOR - Footer component is being created');
  
  const { isEditingMode } = useEditingMode();
  console.log('🌐 [FOOTER] isEditingMode from useEditingMode:', isEditingMode);
  
  const { getGlobalComponent, getTemplateBlocks, getBlockContent } = useContent();
  console.log('🌐 [FOOTER] useContent hooks loaded');
  
  // Get footer global component using generic function
  const footerComponent = getGlobalComponent('footer');
  console.log('🌐 [FOOTER] footerComponent:', footerComponent);
  
  // Get blocks from footer pattern
  const footerBlocks = getTemplateBlocks(footerComponent, 'footer');
  console.log('🌐 [FOOTER] footerBlocks:', footerBlocks);
  
  // Get content from CMS blocks
  const footerContent = {
    companyName: getBlockContent(footerBlocks, 'companyName'),
    email: getBlockContent(footerBlocks, 'email'),
    copyright: getBlockContent(footerBlocks, 'copyright'),
    credits: getBlockContent(footerBlocks, 'credits'),
    creditsLink: getBlockContent(footerBlocks, 'creditsLink')
  };
  console.log('🌐 [FOOTER] footerContent:', footerContent);
  
  console.log('🌐 [FOOTER] About to render KjFooter with props:', {
    isEditingMode,
    content: footerContent
  });
  
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