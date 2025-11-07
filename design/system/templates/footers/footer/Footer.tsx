'use client';

import { Section } from '../../../components/frames/section';
import { Container } from '../../../components/frames/container';
import KjFooter from '../../../patterns/client/_kj-footer/kj-footer';
import { useEditingMode } from '../../../../cms/wrappers/editing';

interface FooterProps {
  section?: {
    footer_fjVaWmY?: {
      type: string;
      pattern?: Array<{
        type: string;
        components?: Record<string, {
          type: string;
          content: string;
        }>;
      }>;
    };
  };
}

const Footer = ({ section }: FooterProps) => {
  const { isEditingMode } = useEditingMode();
  
  // Extract footer content from props
  const footerPattern = section?.footer_fjVaWmY?.pattern?.[0];
  const components = footerPattern?.components || {};
  
  const footerContent = {
    companyName: Object.values(components).find((c: any) => c.type === 'companyName')?.content || '',
    email: Object.values(components).find((c: any) => c.type === 'email')?.content || '',
    copyright: Object.values(components).find((c: any) => c.type === 'copyright')?.content || '',
    credits: Object.values(components).find((c: any) => c.type === 'credits')?.content || '',
    creditsLink: Object.values(components).find((c: any) => c.type === 'creditsLink')?.content || ''
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