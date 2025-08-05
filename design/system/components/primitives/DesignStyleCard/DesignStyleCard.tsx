// ===============================================
// src/design-system/components/primitives/DesignStyleCard/DesignStyleCard.tsx
// DESIGN STYLE GRID - Simple grid for design choices
// ===============================================

import React from 'react';
import { Card, CardContent } from '../Card';
import { Label } from '../Typography';
import { cn } from '../../../lib/utils';

export interface DesignStyle {
  id: string;
  name: string;
  description?: string;
  preview?: string;
  className?: string;
}

export interface DesignStyleGridProps {
  styles: DesignStyle[];
  selectedStyle?: string;
  onStyleSelect?: (styleId: string) => void;
  className?: string;
}

export const DesignStyleGrid: React.FC<DesignStyleGridProps> = ({
  styles,
  selectedStyle,
  onStyleSelect,
  className
}) => {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
      className
    )}>
      {styles.map((style) => (
        <Card
          key={style.id}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            selectedStyle === style.id && "ring-2 ring-blue-500 shadow-lg",
            style.className
          )}
          onClick={() => onStyleSelect?.(style.id)}
        >
          <CardContent className="p-4">
            {style.preview && (
              <div className="mb-3 h-20 rounded overflow-hidden bg-gray-100">
                <div className={style.preview} />
              </div>
            )}
            <Label className="font-medium">{style.name}</Label>
            {style.description && (
              <Label>
                {style.description}
              </Label>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Export for compatibility
export { DesignStyleGrid as DesignStyleCard };