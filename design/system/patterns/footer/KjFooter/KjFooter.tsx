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

const KjFooter = ({ type, props, components = {} }: KjFooterProps) => {
  // Helper function to get components by role
  const getComponentsByRole = (role: string) => 
    Object.entries(components)
      .filter(([key, component]) => component.props?.role === role)
      .map(([key, component]) => ({ ...component, key }));

  // Extract components by their roles
  const titleComponents = getComponentsByRole('title');
  const emailComponents = getComponentsByRole('email');
  const legalComponents = getComponentsByRole('legal');
  const attributeComponents = getComponentsByRole('attribute');

  return (
    <VStack spacing="xl" align="center" fullWidth>
      {/* Header: Logo + Title */}
      <HStack spacing="md" align="center" justify="center">
        <img 
          src="/images/sections/kjlogo.jpg" 
          alt="KJ Marketing Sweden Logo"
          width={40}
          height={40}
          className="object-contain flex-shrink-0"
        />
        {/* Render title components */}
        {titleComponents.map((component, index) => 
          renderComponent(component, component.key, index)
        )}
      </HStack>

      {/* Contact & Legal Info */}
      <VStack spacing="xs" align="center">
        {/* Email components */}
        {emailComponents.map((component, index) => 
          renderComponent(component, component.key, index)
        )}
        {/* Legal components */}
        {legalComponents.map((component, index) => 
          renderComponent(component, component.key, index)
        )}
      </VStack>

      {/* Attribution */}
      <VStack spacing="xs" align="center">
        {attributeComponents.map((component, index) => 
          renderComponent(component, component.key, index)
        )}
      </VStack>
    </VStack>
  );
};

export default KjFooter;