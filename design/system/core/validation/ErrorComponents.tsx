// ===============================================
// blimpify-ui/design/system/core/validation/ErrorComponents.tsx
// Error display components for development mode validation errors
// ===============================================

import React from 'react';
import { ValidationResult } from './schemaValidator';

interface ValidationErrorProps {
  type: 'component' | 'pattern' | 'section';
  nodeType: string;
  nodeKey: string;
  validation: ValidationResult;
}

/**
 * Component validation error display
 * Shows detailed validation errors in development mode
 */
export const ValidationError: React.FC<ValidationErrorProps> = ({
  type,
  nodeType,
  nodeKey,
  validation
}) => {
  const colors = {
    component: { border: '#f44336', bg: '#ffebee', color: '#c62828' },
    pattern: { border: '#ff9800', bg: '#fff3e0', color: '#e65100' },
    section: { border: '#9c27b0', bg: '#f3e5f5', color: '#6a1b9a' }
  };

  const colorScheme = colors[type];

  return (
    <div 
      style={{ 
        padding: type === 'component' ? '8px' : '16px',
        border: `2px solid ${colorScheme.border}`, 
        background: colorScheme.bg,
        color: colorScheme.color,
        fontSize: type === 'component' ? '12px' : '14px',
        margin: '4px',
        borderRadius: '4px',
        fontFamily: 'monospace'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Validation Error
      </div>
      <div style={{ fontSize: '11px', marginBottom: '8px', opacity: 0.8 }}>
        {type}: "{nodeType}" | key: "{nodeKey}"
      </div>
      
      {validation.errors.length > 0 && (
        <div>
          <strong>Errors:</strong>
          <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
            {validation.errors.map((error, i) => (
              <li key={i} style={{ marginBottom: '2px' }}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings && validation.warnings.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <strong>Warnings:</strong>
          <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
            {validation.warnings.map((warning, i) => (
              <li key={i} style={{ marginBottom: '2px', opacity: 0.8 }}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * Simplified error display for production/minimal mode
 */
export const SimpleValidationError: React.FC<{ type: string; message: string }> = ({ 
  type, 
  message 
}) => (
  <div style={{ 
    padding: '4px 8px', 
    background: '#ffebee', 
    border: '1px solid #f44336',
    color: '#c62828',
    fontSize: '12px',
    borderRadius: '2px'
  }}>
    {type} Error: {message}
  </div>
);

/**
 * Development info panel showing validation status
 */
export const ValidationInfo: React.FC<{ 
  validation: ValidationResult;
  type: string;
  showWarnings?: boolean;
}> = ({ 
  validation, 
  type, 
  showWarnings = true 
}) => {
  if (validation.valid && (!validation.warnings || validation.warnings.length === 0)) {
    return null; // No need to show anything for valid nodes without warnings
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      background: validation.valid ? '#e8f5e8' : '#ffebee',
      border: `1px solid ${validation.valid ? '#4caf50' : '#f44336'}`,
      padding: '2px 6px',
      fontSize: '10px',
      borderRadius: '0 0 0 4px',
      zIndex: 1000
    }}>
      {validation.valid ? '✓' : '✗'} {type}
      {validation.warnings && showWarnings && (
        <span style={{ marginLeft: '4px', opacity: 0.7 }}>
          ⚠ {validation.warnings.length}
        </span>
      )}
    </div>
  );
};