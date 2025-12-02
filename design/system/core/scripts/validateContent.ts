import { promises as fs } from 'fs';
import path from 'path';
import { 
  isValidSectionType, 
  validateRequiredPatterns, 
  isPatternAllowed 
} from '../render/validation/sections';
import type { PageNode, SectionNode } from '../types/nodes';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates all content files in a given content directory
 * This runs at build time to catch content errors early
 */
export async function validateContentDirectory(contentPath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    // contentPath should be absolute path to public/content
    const locales = await fs.readdir(contentPath);
    
    for (const locale of locales) {
      const localePath = path.join(contentPath, locale);
      
      // Check if it's a directory
      const stat = await fs.stat(localePath);
      if (!stat.isDirectory()) continue;
      
      const localeResult = await validateLocaleContent(localePath, locale);
      
      result.errors.push(...localeResult.errors);
      result.warnings.push(...localeResult.warnings);
      
      if (!localeResult.isValid) {
        result.isValid = false;
      }
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to read content directory: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

async function validateLocaleContent(localePath: string, locale: string): Promise<ValidationResult> {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
  
  try {
    const files = await fs.readdir(localePath);
    const pageFiles = files.filter(f => 
      f.endsWith('.json') && 
      !['navbar.json', 'footer.json'].includes(f)
    );

    for (const file of pageFiles) {
      const fileResult = await validatePageFile(path.join(localePath, file), `${locale}/${file}`);
      
      result.errors.push(...fileResult.errors);
      result.warnings.push(...fileResult.warnings);
      
      if (!fileResult.isValid) {
        result.isValid = false;
      }
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to read locale directory ${locale}: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

async function validatePageFile(filePath: string, relativePath: string): Promise<ValidationResult> {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const pageData: PageNode = JSON.parse(content);
    
    if (!pageData.sections) return result;
    
    const sectionOrder = pageData.order || Object.keys(pageData.sections);
    
    for (const sectionKey of sectionOrder) {
      const section = pageData.sections[sectionKey];
      if (section) {
        const sectionResult = validateSectionContent(section, sectionKey, relativePath);
        
        result.errors.push(...sectionResult.errors);
        result.warnings.push(...sectionResult.warnings);
        
        if (!sectionResult.isValid) {
          result.isValid = false;
        }
      }
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(`${relativePath}: Failed to parse JSON - ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

function validateSectionContent(section: SectionNode, sectionKey: string, filePath: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
  const { type, patterns } = section;
  
  // Validate section type
  if (!isValidSectionType(type)) {
    result.isValid = false;
    result.errors.push(`${filePath} > Section "${sectionKey}": Invalid section type "${type}"`);
    return result; // Skip pattern validation for invalid sections
  }
  
  // Validate required patterns
  if (!validateRequiredPatterns(type, patterns || {})) {
    result.isValid = false;
    result.errors.push(`${filePath} > Section "${sectionKey}": Missing required patterns for type "${type}"`);
  }
  
  // Validate individual patterns
  if (patterns) {
    const patternOrder = section.order || Object.keys(patterns);
    
    for (const patternKey of patternOrder) {
      const pattern = patterns[patternKey];
      
      if (pattern && !isPatternAllowed(type, pattern.type)) {
        result.warnings.push(`${filePath} > Section "${sectionKey}" > Pattern "${patternKey}": Type "${pattern.type}" not recommended for section type "${type}"`);
      }
    }
  }

  return result;
}

// CLI entrypoint - kan köras från terminalen
export async function runContentValidation(contentPath?: string): Promise<void> {
  const defaultPath = path.join(process.cwd(), 'public', 'content');
  const pathToValidate = contentPath || defaultPath;
  
  console.log(`🔍 Validating content in: ${pathToValidate}`);
  
  const result = await validateContentDirectory(pathToValidate);
  
  console.log(`\n📊 Validation completed:`);
  console.log(`   Warnings: ${result.warnings.length}`);
  console.log(`   Errors: ${result.errors.length}`);
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    result.warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  if (result.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    result.errors.forEach(error => console.log(`   ${error}`));
    console.log('\n💥 Validation failed!');
    process.exit(1);
  }
  
  console.log('\n✅ All content is valid!');
}

// Make it runnable from command line
if (require.main === module) {
  const contentPath = process.argv[2];
  runContentValidation(contentPath).catch(console.error);
}