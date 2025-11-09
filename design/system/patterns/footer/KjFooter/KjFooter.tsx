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
  // Convert components object to ComponentNode array
  const componentsList = Object.entries(components).map(([key, component]) => ({
    ...component,
    key
  } as ComponentNode & { key: string }));

  // Separate header components (logo + title) from body components
  const logoComponent = componentsList.find(comp => comp.key.includes('logo'));
  const titleComponent = componentsList.find(comp => comp.key.includes('title'));
  const bodyComponents = componentsList.filter(comp => 
    !comp.key.includes('logo') && !comp.key.includes('title')
  );

  // Render components using renderComponent
  const renderedLogo = logoComponent ? renderComponent(logoComponent, logoComponent.key, 0) : null;
  const renderedTitle = titleComponent ? renderComponent(titleComponent, titleComponent.key, 1) : null;
  const renderedBodyComponents = bodyComponents.map((component, index) => 
    renderComponent(component, component.key, index + 2)
  );

  return (
    <VStack spacing="xl" align="center" fullWidth>
      {/* Header Section - Logo + Title in HStack */}
      <HStack spacing="md" align="center" justify="center">
        {renderedLogo}
        {renderedTitle}
      </HStack>

      {/* Body Components */}
      <VStack spacing="xs" align="center">
        {renderedBodyComponents}
      </VStack>
    </VStack>
  );
};

export default KjFooter;