// Editable, hidden, useMediaWidth settings för props i component och pattern.
// Interface för tillåtna props i component nivå, pattern nivå och section nivå.

import { PropDefinition } from "./types";
/**
 * Common component props schema
 * These props can be used across multiple component types
 */
export const PatternProps: PropDefinition[] = [
  {
    name: 'useMediaWidth',
    type: 'boolean',
    required: false,
    defaultValue: false,
    description: 'Adjust the container width to use media width',
    usedBy: ['typography', 'button', 'tag', 'link']
  },
];