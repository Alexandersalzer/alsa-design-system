/**
 * Page Validation CLI Script
 * 
 * Validates all pages in a Blimpify client project.
 * Can be run manually or as part of CI/CD pipeline.
 * 
 * Usage:
 *   npm run validate:pages
 *   npm run validate:pages -- /path/to/client/public
 *   npm run validate:pages -- /path/to/client/public sv,en,no
 */

import path from 'path';
import {
  validateRequiredDirectories,
  validateRequiredFiles,
  validatePageNames,
  validateContentFiles,
  validateFileNameConsistency,
  detectLocales,
  type FileValidationResult,
} from '../validators/page-files.validator';
import { validatePageContent } from '../validators/page-content.validator';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

export interface ValidationSummary {
  totalPages: number;
  validPages: number;
  totalErrors: number;
  totalWarnings: number;
  duration: number;
  success: boolean;
}

/**
 * Format and print validation results
 */
function printResult(
  title: string,
  result: FileValidationResult
) {
  const icon = result.valid ? '✅' : '❌';
  const color = result.valid ? colors.green : colors.red;
  
  console.log(`\n${color}${icon} ${title}${colors.reset}`);
  
  if (result.errors.length > 0) {
    console.log(`${colors.red}  Errors:${colors.reset}`);
    result.errors.forEach(err => console.log(`    - ${err}`));
  }
  
  if (result.warnings.length > 0) {
    console.log(`${colors.yellow}  Warnings:${colors.reset}`);
    result.warnings.forEach(warn => console.log(`    - ${warn}`));
  }
}

/**
 * Main validation function
 */
export async function validatePages(
  publicDir: string,
  providedLocales?: string[]
): Promise<ValidationSummary> {
  const startTime = Date.now();
  
  console.log(`\n${colors.bright}${colors.cyan}🔍 Blimpify Page Validator${colors.reset}`);
  console.log(`${colors.blue}Validating: ${publicDir}${colors.reset}\n`);
  console.log('─'.repeat(60));

  let totalErrors = 0;
  let totalWarnings = 0;
  let validPages = 0;

  // Step 1: Validate directory structure
  console.log(`\n${colors.bright}📁 Step 1: Directory Structure${colors.reset}`);
  const dirResult = validateRequiredDirectories(publicDir);
  printResult('Required Directories', dirResult);
  totalErrors += dirResult.errors.length;
  totalWarnings += dirResult.warnings.length;

  if (!dirResult.valid) {
    console.log(`\n${colors.red}❌ Cannot continue - required directories missing${colors.reset}\n`);
    return {
      totalPages: 0,
      validPages: 0,
      totalErrors,
      totalWarnings,
      duration: Date.now() - startTime,
      success: false
    };
  }

  // Step 2: Validate required files
  console.log(`\n${colors.bright}📄 Step 2: Required Files${colors.reset}`);
  const filesResult = validateRequiredFiles(publicDir);
  printResult('Required Files', filesResult);
  totalErrors += filesResult.errors.length;
  totalWarnings += filesResult.warnings.length;

  // Step 3: Detect or use provided locales
  const locales = providedLocales || detectLocales(publicDir);
  
  if (locales.length === 0) {
    console.log(`\n${colors.red}❌ No locales found in /public/content${colors.reset}\n`);
    return {
      totalPages: 0,
      validPages: 0,
      totalErrors: totalErrors + 1,
      totalWarnings,
      duration: Date.now() - startTime,
      success: false
    };
  }

  console.log(`\n${colors.bright}🌍 Detected Locales:${colors.reset} ${colors.cyan}${locales.join(', ')}${colors.reset}`);

  // Step 4: Validate page names
  console.log(`\n${colors.bright}🏷️  Step 3: Page Name Validation${colors.reset}`);
  const namesResult = validatePageNames(publicDir);
  printResult('Page Names', namesResult);
  totalErrors += namesResult.errors.length;
  totalWarnings += namesResult.warnings.length;

  const foundPages = namesResult.details?.foundPages || [];
  
  if (foundPages.length > 0) {
    console.log(`${colors.dim}  Found ${foundPages.length} page(s): ${foundPages.join(', ')}${colors.reset}`);
  }

  // Step 5: Validate content files exist
  console.log(`\n${colors.bright}🗂️  Step 4: Content File Structure${colors.reset}`);
  const contentFilesResult = validateContentFiles(publicDir, locales);
  printResult('Content Files', contentFilesResult);
  totalErrors += contentFilesResult.errors.length;
  totalWarnings += contentFilesResult.warnings.length;

  // Step 6: Validate file name consistency
  console.log(`\n${colors.bright}🔗 Step 5: File Name Consistency${colors.reset}`);
  const consistencyResult = validateFileNameConsistency(publicDir, locales);
  printResult('File Consistency', consistencyResult);
  totalErrors += consistencyResult.errors.length;
  totalWarnings += consistencyResult.warnings.length;

  // Step 7: Validate page JSON content structure
  if (foundPages.length > 0) {
    console.log(`\n${colors.bright}📋 Step 6: Page Content Validation${colors.reset}`);
    console.log(`${colors.dim}Validating section types, structure, and positioning rules...${colors.reset}\n`);
    
    for (const slug of foundPages) {
      const pageResult = validatePageContent(publicDir, slug, locales);
      
      const status = pageResult.valid ? '✅' : '❌';
      const color = pageResult.valid ? colors.green : colors.red;
      
      // Page header with details
      let header = `${color}${status} ${colors.bright}${slug}${colors.reset}`;
      
      if (pageResult.details) {
        const { sectionCount, sectionTypes } = pageResult.details;
        if (sectionCount !== undefined && sectionTypes) {
          header += ` ${colors.dim}(${sectionCount} sections: ${sectionTypes.join(', ')})${colors.reset}`;
        }
      }
      
      console.log(header);
      
      if (pageResult.errors.length > 0) {
        console.log(`${colors.red}  Errors:${colors.reset}`);
        pageResult.errors.forEach(err => console.log(`    - ${err}`));
      }
      
      if (pageResult.warnings.length > 0) {
        console.log(`${colors.yellow}  Warnings:${colors.reset}`);
        pageResult.warnings.forEach(warn => console.log(`    - ${warn}`));
      }
      
      totalErrors += pageResult.errors.length;
      totalWarnings += pageResult.warnings.length;
      
      if (pageResult.valid) {
        validPages++;
      }
      
      console.log(''); // Empty line between pages
    }
  }

  // Summary
  const duration = Date.now() - startTime;
  const success = totalErrors === 0;
  
  console.log('─'.repeat(60));
  console.log(`\n${colors.bright}${colors.cyan}📊 Validation Summary${colors.reset}`);
  console.log(`  ${colors.dim}Project:${colors.reset} ${path.basename(path.dirname(publicDir))}`);
  console.log(`  ${colors.dim}Pages validated:${colors.reset} ${foundPages.length}`);
  console.log(`  ${colors.dim}Pages valid:${colors.reset} ${colors.green}${validPages}${colors.reset}`);
  console.log(`  ${colors.dim}Pages invalid:${colors.reset} ${colors.red}${foundPages.length - validPages}${colors.reset}`);
  console.log(`  ${colors.dim}Locales:${colors.reset} ${locales.join(', ')}`);
  
  if (success) {
    console.log(`  ${colors.green}${colors.bright}✅ Status: PASSED${colors.reset}`);
  } else {
    console.log(`  ${colors.red}${colors.bright}❌ Status: FAILED${colors.reset}`);
  }
  
  console.log(`  ${colors.red}Errors: ${totalErrors}${colors.reset}`);
  console.log(`  ${colors.yellow}Warnings: ${totalWarnings}${colors.reset}`);
  console.log(`  ${colors.dim}Duration: ${duration}ms${colors.reset}`);
  console.log('');

  return {
    totalPages: foundPages.length,
    validPages,
    totalErrors,
    totalWarnings,
    duration,
    success
  };
}

// CLI entry point
if (require.main === module) {
  const publicDir = process.argv[2] || path.join(process.cwd(), 'public');
  const locales = process.argv[3]?.split(',');

  validatePages(publicDir, locales).then(summary => {
    process.exit(summary.success ? 0 : 1);
  });
}
