// ===============================================
// src/design-system/components/layout/ResizeHandle/ResizeHandle.tsx
// Draggable resize handle for panel/sidebar resizing
// ===============================================

import React, { forwardRef, useState, useCallback, useEffect, useRef } from 'react';
import './ResizeHandle.css';

// ===============================================
// TYPES
// ===============================================

export interface ResizeHandleProps {
  /** Orientation of the resize handle */
  orientation?: 'vertical' | 'horizontal';
  
  /** Position relative to parent (affects which direction expands) */
  position?: 'start' | 'end';
  
  /** Visual style of the handle */
  handleStyle?: 'compact' | 'full';
  
  /** Whether the associated panel is collapsed */
  collapsed?: boolean;
  
  /** Current size value (for aria) */
  currentValue?: number;
  
  /** Minimum size value (for aria) */
  minValue?: number;
  
  /** Maximum size value (for aria) */
  maxValue?: number;
  
  /** Callback when drag starts */
  onDragStart?: (e: React.MouseEvent) => void;
  
  /** Callback when dragging */
  onDrag?: (e: MouseEvent) => void;
  
  /** Callback when drag ends */
  onDragEnd?: (e: MouseEvent) => void;
  
  /** Callback for double-click (typically reset to default) */
  onDoubleClick?: () => void;
  
  /** Callback for keyboard navigation */
  onKeyDown?: (e: React.KeyboardEvent) => void;
  
  /** Accessible label */
  'aria-label'?: string;
  
  /** Additional CSS class */
  className?: string;
  
  /** Whether the handle is disabled */
  disabled?: boolean;
}

// ===============================================
// COMPONENT
// ===============================================

export const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(({
  orientation = 'vertical',
  position = 'end',
  handleStyle = 'compact',
  collapsed = false,
  currentValue,
  minValue = 0,
  maxValue,
  onDragStart,
  onDrag,
  onDragEnd,
  onDoubleClick,
  onKeyDown,
  'aria-label': ariaLabel = 'Resize handle',
  className = '',
  disabled = false,
}, ref) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const internalRef = useRef<HTMLDivElement>(null);
  
  // Use forwarded ref or internal ref
  const handleRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

  // ===== DRAG HANDLERS =====
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    document.body.style.cursor = orientation === 'vertical' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';

    // Disable pointer events on all iframes to prevent them from stealing mouse events
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      (iframe as HTMLIFrameElement).style.pointerEvents = 'none';
    });

    onDragStart?.(e);
  }, [disabled, orientation, onDragStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    onDrag?.(e);
  }, [isDragging, onDrag]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    setIsDragging(false);
    setIsHovering(false); // Reset hover to prevent stuck state
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // Re-enable pointer events on all iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      (iframe as HTMLIFrameElement).style.pointerEvents = '';
    });

    onDragEnd?.(e);
  }, [isDragging, onDragEnd]);

  // ===== GLOBAL EVENT LISTENERS =====
  useEffect(() => {
    if (isDragging) {
      // Listen on both window and document to ensure we catch mouseup everywhere
      // Use capture phase (true) to ensure we get the event before anything else
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp, true);
      document.addEventListener('mouseup', handleMouseUp, true);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp, true);
        document.removeEventListener('mouseup', handleMouseUp, true);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // ===== BUILD CLASS NAMES =====
  const classNames = [
    'resize-handle',
    `resize-handle--${orientation}`,
    `resize-handle--${position}`,
    `resize-handle--${handleStyle}`,
    collapsed && 'resize-handle--collapsed',
    isHovering && 'resize-handle--hover',
    isDragging && 'resize-handle--active',
    disabled && 'resize-handle--disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={handleRef}
      className={classNames}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => !disabled && setIsHovering(true)}
      onMouseLeave={() => !disabled && setIsHovering(false)}
      onDoubleClick={disabled ? undefined : onDoubleClick}
      onKeyDown={disabled ? undefined : onKeyDown}
      role="separator"
      aria-orientation={orientation}
      aria-valuenow={currentValue}
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
    >
      <div className="resize-handle__indicator" />
    </div>
  );
});

ResizeHandle.displayName = 'ResizeHandle';

export default ResizeHandle;