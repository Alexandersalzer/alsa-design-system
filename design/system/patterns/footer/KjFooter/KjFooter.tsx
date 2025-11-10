'use client';

import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { renderComponentsByRole } from '../../../core/utils/helpers';
import { PatternNode } from '../../../core/types/nodes';

const KjFooter = ({ components = {} }: PatternNode) => {

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
        {renderComponentsByRole(components, 'title')}
      </HStack>

      {/* Contact & Legal Info */}
      <VStack spacing="xs" align="center">
        {/* Email & Legal components */}
        {renderComponentsByRole(components, 'email')}
        {renderComponentsByRole(components, 'legal')}
      </VStack>

      {/* Attribution */}
      <VStack spacing="xs" align="center">
        {renderComponentsByRole(components, 'attribute')}
      </VStack>
    </VStack>
  );
};

export default KjFooter;