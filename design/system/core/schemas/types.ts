export interface PropDefinition {
  /** The prop name/key */
  name: string;
  /** Data type of the prop */
  type: 'string' | 'boolean' | 'number' | 'array' | 'object';
  /** Whether this prop is required */
  required?: boolean;
  /** Default value if not provided */
  defaultValue?: any;
  /** Description of what this prop does */
  description: string;
  /** Component or pattern types that can use this prop */
  usedBy: string[];
}