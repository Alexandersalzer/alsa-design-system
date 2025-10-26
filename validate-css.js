#!/usr/bin/env node

/**
 * Validates that all CSS @import paths in index.css actually exist
 * Exits with code 1 if any files are missing (stops build/publish)
 */

const fs = require('fs');
const path = require('path');

const indexCssPath = path.join(__dirname, 'design', 'system', 'index.css');
const baseDir = path.join(__dirname, 'design', 'system');

console.log('🔍 Validating CSS imports...\n');

// Read index.css
if (!fs.existsSync(indexCssPath)) {
  console.error(`❌ Could not find ${indexCssPath}`);
  process.exit(1);
}

const content = fs.readFileSync(indexCssPath, 'utf-8');

// Extract all @import paths
const importRegex = /@import\s+['"]([^'"]+)['"]/g;
const imports = [];
let match;

while ((match = importRegex.exec(content)) !== null) {
  imports.push(match[1]);
}

console.log(`Checking ${imports.length} CSS imports...\n`);

// Validate each import
let missing = [];

imports.forEach((importPath) => {
  const fullPath = path.join(baseDir, importPath);
  
  if (!fs.existsSync(fullPath)) {
    missing.push(importPath);
    console.error(`❌ ${importPath}`);
  }
});

// Result
if (missing.length > 0) {
  console.error(`\n❌ ${missing.length} CSS file(s) missing!`);
  console.error('\nMissing files:');
  missing.forEach(file => console.error(`  - ${file}`));
  console.error('\n⚠️  Build would fail. Please fix these imports in design/system/index.css\n');
  process.exit(1);
} else {
  console.log(`✅ All ${imports.length} CSS imports are valid!\n`);
  process.exit(0);
}
