/**
 * Template Reference Resolution System
 *
 * Detects and resolves template references from the pattern gallery registry.
 * Allows templates to be defined once and reused across multiple patterns/sections.
 */

import { PatternTemplate, getPatternTemplate } from '@blimpify-im/patternsgallery';

/**
 * Checks if a template value is a reference to a pattern template
 * Detection strategies:
 * 1. String starting with "ref:" (e.g., "ref:pricing-card-three-tier")
 * 2. Object with templateId property
 * 3. String matching a known template ID from registry
 */
export function isTemplateReference(template: any): boolean {
  if (!template) return false;

  // Strategy 1: Explicit "ref:" prefix
  if (typeof template === 'string' && template.startsWith('ref:')) {
    return true;
  }

  // Strategy 2: Object with templateId
  if (typeof template === 'object' && template.templateId) {
    return true;
  }

  // Strategy 3: String that matches a known template ID
  if (typeof template === 'string') {
    const matchedTemplate = getPatternTemplate(template);
    return matchedTemplate !== undefined;
  }

  return false;
}

/**
 * Extracts template ID from various reference formats
 */
export function extractTemplateId(templateRef: any): string | undefined {
  if (typeof templateRef === 'string') {
    // Remove "ref:" prefix if present
    return templateRef.startsWith('ref:') ? templateRef.slice(4) : templateRef;
  }

  if (typeof templateRef === 'object' && templateRef.templateId) {
    return templateRef.templateId;
  }

  return undefined;
}

/**
 * Resolves ${variable} placeholders in a template node
 *
 * @param node - Template node that may contain ${...} placeholders
 * @param variableMapping - Map of variable names to values
 * @returns Node with all ${...} placeholders replaced
 */
function resolveTemplateVariables(
  node: any,
  variableMapping: Record<string, any>
): any {
  if (typeof node === 'string') {
    // Check if it's a ${variable} placeholder
    if (node.startsWith('${') && node.endsWith('}')) {
      const varName = node.slice(2, -1);
      return variableMapping[varName] ?? node;
    }
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(item => resolveTemplateVariables(item, variableMapping));
  }

  if (typeof node === 'object' && node !== null) {
    const resolved: any = {};
    for (const [key, value] of Object.entries(node)) {
      resolved[key] = resolveTemplateVariables(value, variableMapping);
    }
    return resolved;
  }

  return node;
}

/**
 * Resolves component references from template to actual component keys
 *
 * Example:
 * Template has: { component: "${heading}" }
 * componentMapping says: { "heading": "${heading}" }
 * Result: Component reference stays as ${heading} (handled by existing renderer)
 *
 * This allows the template to use generic slots that get filled by item components
 */
function resolveComponentMapping(
  template: any,
  componentMapping?: Record<string, string>
): any {
  // Component mapping is optional - if not provided, template uses its own component refs
  if (!componentMapping) return template;

  // For now, we don't need to modify the template
  // The existing renderer already handles ${componentType} references
  // componentMapping is just for documentation/validation
  return template;
}

/**
 * Main resolver: Resolves a template reference to actual template structure
 *
 * @param templateRef - Template reference (string ID or object with templateId)
 * @param variableMapping - Optional mapping of variables like ${cardVariant} to actual values
 * @param componentMapping - Optional mapping of component slots (for documentation)
 * @returns Resolved template structure ready for rendering
 */
export function resolveTemplateReference(
  templateRef: any,
  variableMapping?: Record<string, any>,
  componentMapping?: Record<string, string>
): any {
  // Extract template ID
  const templateId = extractTemplateId(templateRef);
  if (!templateId) {
    console.warn('Could not extract template ID from reference:', templateRef);
    return null;
  }

  // Get template from registry
  const patternTemplate = getPatternTemplate(templateId);
  if (!patternTemplate) {
    console.warn(`Pattern template "${templateId}" not found in registry`);
    return null;
  }

  // Get the base template structure
  let resolvedTemplate = { ...patternTemplate.template };

  // Resolve ${variable} placeholders if variableMapping provided
  if (variableMapping) {
    resolvedTemplate = resolveTemplateVariables(resolvedTemplate, variableMapping);
  }

  // Apply component mapping (currently a no-op, for future use)
  resolvedTemplate = resolveComponentMapping(resolvedTemplate, componentMapping);

  return resolvedTemplate;
}

/**
 * Higher-level resolver for layout.template property
 * Handles both direct templates and template references
 *
 * Usage in layout:
 * Option 1 (Direct): layout.template = { children: [...] }
 * Option 2 (Reference): layout.template = "pricing-card-three-tier"
 * Option 3 (Reference with config): layout.template = { templateId: "pricing-card-three-tier", variableMapping: {...} }
 */
export function resolveLayoutTemplate(
  template: any,
  item?: any
): any {
  // If template is not a reference, return as-is (direct template)
  if (!isTemplateReference(template)) {
    return template;
  }

  // Extract variable and component mappings from the reference object
  const variableMapping = typeof template === 'object' ? template.variableMapping : undefined;
  const componentMapping = typeof template === 'object' ? template.componentMapping : undefined;

  // If item has variables (like cardVariant), merge them into variableMapping
  const mergedVariableMapping = item ? { ...variableMapping, ...item } : variableMapping;

  // Resolve the reference
  return resolveTemplateReference(template, mergedVariableMapping, componentMapping);
}
