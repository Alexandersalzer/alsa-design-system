import { promises as fs } from 'fs';
import path from 'path';
import type { PageNode, SectionNode, PatternNode, ComponentNode } from '../types/nodes';
import { isValidSectionType } from '../render/validation/sections';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates JSON structure against nodes.ts interfaces
 */
export async function validateJsonStructure(contentPath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    const locales = await fs.readdir(contentPath);
    
    for (const locale of locales) {
      const localePath = path.join(contentPath, locale);
      const stat = await fs.stat(localePath);
      if (!stat.isDirectory()) continue;
      
      const localeResult = await validateLocaleStructure(localePath, locale);
      mergeResults(result, localeResult);
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to read content directory: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

async function validateLocaleStructure(localePath: string, locale: string): Promise<ValidationResult> {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
  
  try {
    const files = await fs.readdir(localePath);
    const pageFiles = files.filter(f => 
      f.endsWith('.json') && 
      !['navbar.json', 'footer.json'].includes(f)
    );

    for (const file of pageFiles) {
      const fileResult = await validatePageStructure(path.join(localePath, file), `${locale}/${file}`);
      mergeResults(result, fileResult);
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to read locale directory ${locale}: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

async function validatePageStructure(filePath: string, relativePath: string): Promise<ValidationResult> {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Validate PageNode structure
    const pageResult = validatePageNode(data, relativePath);
    mergeResults(result, pageResult);
    
  } catch (error) {
    result.isValid = false;
    result.errors.push(`${relativePath}: Failed to parse JSON - ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

function validatePageNode(data: any, filePath: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
  
  // Required properties for PageNode
  const requiredProps = ['name', 'locale', 'props', 'sections', 'order'];
  
  for (const prop of requiredProps) {
    if (!(prop in data)) {
      result.isValid = false;
      result.errors.push(`${filePath}: Missing required property "${prop}" in PageNode`);
    }
  }
  
  // Validate property types
  if (typeof data.name !== 'string') {
    result.isValid = false;
    result.errors.push(`${filePath}: PageNode.name must be string, got ${typeof data.name}`);
  }
  
  if (typeof data.locale !== 'string') {
    result.isValid = false;
    result.errors.push(`${filePath}: PageNode.locale must be string, got ${typeof data.locale}`);
  }
  
  if (typeof data.props !== 'object' || data.props === null) {
    result.isValid = false;
    result.errors.push(`${filePath}: PageNode.props must be object, got ${typeof data.props}`);
  }
  
  if (!Array.isArray(data.order)) {
    result.isValid = false;
    result.errors.push(`${filePath}: PageNode.order must be array, got ${typeof data.order}`);
  }
  
  // Validate sections
  if (typeof data.sections === 'object' && data.sections !== null) {
    for (const [sectionKey, sectionData] of Object.entries(data.sections)) {
      const sectionResult = validateSectionNode(sectionData, `${filePath} > Section "${sectionKey}"`);
      mergeResults(result, sectionResult);
    }
    
    // Validate order matches section keys
    if (Array.isArray(data.order)) {
      const sectionKeys = Object.keys(data.sections);
      const missingInOrder = sectionKeys.filter((key: string) => !data.order.includes(key));
      const extraInOrder = data.order.filter((key: string) => !sectionKeys.includes(key));
      
      if (missingInOrder.length > 0) {
        result.errors.push(`${filePath}: Section keys missing from order: ${missingInOrder.join(', ')}`);
      }
      
      if (extraInOrder.length > 0) {
        result.errors.push(`${filePath}: Order contains non-existent sections: ${extraInOrder.join(', ')}`);
      }
    }
  }
  
  return result;
}

function validateSectionNode(data: any, context: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
  
  // Required properties for SectionNode
  const requiredProps = ['type', 'props', 'patterns', 'order'];
  
  for (const prop of requiredProps) {
    if (!(prop in data)) {
      result.isValid = false;
      result.errors.push(`${context}: Missing required property "${prop}" in SectionNode`);
    }
  }
  
  // Validate section type
  if (typeof data.type === 'string' && !isValidSectionType(data.type)) {
    result.warnings.push(`${context}: Unknown section type "${data.type}"`);
  }
  
  if (typeof data.props !== 'object' || data.props === null) {
    result.isValid = false;
    result.errors.push(`${context}: SectionNode.props must be object, got ${typeof data.props}`);
  }
  
  if (!Array.isArray(data.order)) {
    result.isValid = false;
    result.errors.push(`${context}: SectionNode.order must be array, got ${typeof data.order}`);
  }
  
  // Validate patterns
  if (typeof data.patterns === 'object' && data.patterns !== null) {
    for (const [patternKey, patternData] of Object.entries(data.patterns)) {
      const patternResult = validatePatternNode(patternData, `${context} > Pattern "${patternKey}"`);
      mergeResults(result, patternResult);
    }
    
    // Validate order matches pattern keys
    if (Array.isArray(data.order)) {
      const patternKeys = Object.keys(data.patterns);
      const missingInOrder = patternKeys.filter((key: string) => !data.order.includes(key));
      const extraInOrder = data.order.filter((key: string) => !patternKeys.includes(key));
      
      if (missingInOrder.length > 0) {
        result.errors.push(`${context}: Pattern keys missing from order: ${missingInOrder.join(', ')}`);
      }
      
      if (extraInOrder.length > 0) {
        result.errors.push(`${context}: Order contains non-existent patterns: ${extraInOrder.join(', ')}`);
      }
    }
  }
  
  return result;
}

function validatePatternNode(data: any, context: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
  
  // Required properties for PatternNode
  const requiredProps = ['type', 'props', 'components', 'order'];
  
  for (const prop of requiredProps) {
    if (!(prop in data)) {
      result.isValid = false;
      result.errors.push(`${context}: Missing required property "${prop}" in PatternNode`);
    }
  }
  
  if (typeof data.type !== 'string') {
    result.isValid = false;
    result.errors.push(`${context}: PatternNode.type must be string, got ${typeof data.type}`);
  }
  
  if (typeof data.props !== 'object' || data.props === null) {
    result.isValid = false;
    result.errors.push(`${context}: PatternNode.props must be object, got ${typeof data.props}`);
  }
  
  if (!Array.isArray(data.order)) {
    result.isValid = false;
    result.errors.push(`${context}: PatternNode.order must be array, got ${typeof data.order}`);
  }
  
  // Validate components
  if (typeof data.components === 'object' && data.components !== null) {
    for (const [componentKey, componentData] of Object.entries(data.components)) {
      const componentResult = validateComponentNode(componentData, `${context} > Component "${componentKey}"`);
      mergeResults(result, componentResult);
    }
    
    // Validate order matches component keys
    if (Array.isArray(data.order)) {
      const componentKeys = Object.keys(data.components);
      const missingInOrder = componentKeys.filter((key: string) => !data.order.includes(key));
      const extraInOrder = data.order.filter((key: string) => !componentKeys.includes(key));
      
      if (missingInOrder.length > 0) {
        result.errors.push(`${context}: Component keys missing from order: ${missingInOrder.join(', ')}`);
      }
      
      if (extraInOrder.length > 0) {
        result.errors.push(`${context}: Order contains non-existent components: ${extraInOrder.join(', ')}`);
      }
    }
  }
  
  return result;
}

function validateComponentNode(data: any, context: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
  
  // Required properties for ComponentNode
  const requiredProps = ['type', 'props'];
  
  for (const prop of requiredProps) {
    if (!(prop in data)) {
      result.isValid = false;
      result.errors.push(`${context}: Missing required property "${prop}" in ComponentNode`);
    }
  }
  
  if (typeof data.type !== 'string') {
    result.isValid = false;
    result.errors.push(`${context}: ComponentNode.type must be string, got ${typeof data.type}`);
  }
  
  if (typeof data.props !== 'object' || data.props === null) {
    result.isValid = false;
    result.errors.push(`${context}: ComponentNode.props must be object, got ${typeof data.props}`);
  }
  
  return result;
}

function mergeResults(target: ValidationResult, source: ValidationResult): void {
  target.errors.push(...source.errors);
  target.warnings.push(...source.warnings);
  if (!source.isValid) {
    target.isValid = false;
  }
}

// CLI entrypoint
export async function runJsonStructureValidation(contentPath?: string): Promise<void> {
  const defaultPath = path.join(process.cwd(), 'public', 'content');
  const pathToValidate = contentPath || defaultPath;
  
  console.log(`🔍 Validating JSON structure against nodes.ts in: ${pathToValidate}`);
  
  const result = await validateJsonStructure(pathToValidate);
  
  console.log(`\n📊 Structure validation completed:`);
  console.log(`   Warnings: ${result.warnings.length}`);
  console.log(`   Errors: ${result.errors.length}`);
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    result.warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  if (result.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    result.errors.forEach(error => console.log(`   ${error}`));
    console.log('\n💥 Structure validation failed!');
    process.exit(1);
  }
  
  console.log('\n✅ All JSON structures are valid!');
}

// Make it runnable from command line
if (require.main === module) {
  const contentPath = process.argv[2];
  runJsonStructureValidation(contentPath).catch(console.error);
}