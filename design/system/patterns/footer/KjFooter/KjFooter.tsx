'use client';

import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { renderComponent } from '../../../core/render/renderSections';
import { ComponentNode } from '../../../core/types/nodes';

interface KjFooterProps {
  type?: string;
  props?: Record<string, any>;
  components?: Record<string, {
    type: string;
    props: Record<string, any>;
  }>;
}

const KjFooter = ({ type, props = {}, components = {} }: KjFooterProps) => {
  // Extract props with defaults from schema
  const logoSpacing = props.logoSpacing || 'xl';
  const contentSpacing = props.contentSpacing || 'xs';
  const showLogo = props.showLogo !== undefined ? props.showLogo : true;

  // Convert components object to ComponentNode array
  const componentsList = Object.entries(components).map(([key, component]) => ({
    ...component,
    key
  } as ComponentNode & { key: string }));

  // Render all components using renderComponent
  const renderedComponents = componentsList.map((component, index) => 
    renderComponent(component, component.key, index)
  );

  return (
    <VStack spacing={logoSpacing} align="center" fullWidth>
      {/* Logo Section - Conditional based on props */}
      {showLogo && (
        <HStack spacing="md" align="center" justify="center">
          <img 
            src="/images/sections/kjlogo.jpg" 
            alt="KJ Marketing Sweden Logo"
            width={40}
            height={40}
            className="object-contain flex-shrink-0"
          />
        </HStack>
      )}

      {/* Schema-driven components */}
      <VStack spacing={contentSpacing} align="center">
        {renderedComponents}
      </VStack>
    </VStack>
  );
};

export default KjFooter;