'use client';

import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { renderComponent } from '../../../core/render/renderSections';
import { getComponentsByRole } from '../../../core/utils/componentHelpers';
import { PatternNode } from '../../../core/types/nodes';

const KjFooter = ({ components = {} }: PatternNode) => {
  // Extract components by their roles using shared utility
  const titleComponents = getComponentsByRole(components, 'title');
  const emailComponents = getComponentsByRole(components, 'email');
  const legalComponents = getComponentsByRole(components, 'legal');
  const attributeComponents = getComponentsByRole(components, 'attribute');

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
        {titleComponents.map(([key, component], index) => 
          renderComponent(component, key, index)
        )}
      </HStack>

      {/* Contact & Legal Info */}
      <VStack spacing="xs" align="center">
        {/* Email components */}
        {emailComponents.map(([key, component], index) => 
          renderComponent(component, key, index)
        )}
        {/* Legal components */}
        {legalComponents.map(([key, component], index) => 
          renderComponent(component, key, index)
        )}
      </VStack>

      {/* Attribution */}
      <VStack spacing="xs" align="center">
        {attributeComponents.map(([key, component], index) => 
          renderComponent(component, key, index)
        )}
      </VStack>
    </VStack>
  );
};

export default KjFooter;