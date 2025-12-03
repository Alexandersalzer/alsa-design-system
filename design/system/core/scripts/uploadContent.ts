import { promises as fs } from 'fs';
import path from 'path';
import type { PageNode } from '../types/nodes';

interface UploadConfig {
  environment: 'dev' | 'prod';
  username: string;
  websiteVersion: string;
  apiUrl: string;
}

interface UploadResult {
  success: boolean;
  uploaded: number;
  errors: string[];
}

/**
 * Parse command line arguments for upload configuration
 */
function parseUploadArgs(): UploadConfig | null {
  const args = process.argv.slice(2);
  
  // Expected format: upload:dev:badbunny:ver2_badbunny
  if (args.length === 0) return null;
  
  const parts = args[0].split(':');
  if (parts.length !== 4 || parts[0] !== 'upload') return null;
  
  const [, environment, username, websiteVersion] = parts;
  
  if (!['dev', 'prod'].includes(environment)) {
    throw new Error(`Invalid environment: ${environment}. Must be 'dev' or 'prod'`);
  }
  
  // Get API config from environment
  const apiUrl = environment === 'dev' 
    ? process.env.BLIMPIFY_API_DEV_URL || 'https://devapi.blimpify-im.com'
    : process.env.BLIMPIFY_API_PROD_URL || 'https://api.blimpify-im.com';
  
  if (!apiUrl) {
    throw new Error(`Missing API URL for ${environment} environment`);
  }
  
  return {
    environment: environment as 'dev' | 'prod',
    username,
    websiteVersion,
    apiUrl
  };
}

/**
 * Upload content to database via API
 */
async function uploadContentToDatabase(contentPath: string, config: UploadConfig): Promise<UploadResult> {
  const result: UploadResult = {
    success: true,
    uploaded: 0,
    errors: []
  };
  
  try {
    console.log(`🚀 Uploading content to ${config.environment.toUpperCase()} for ${config.username}/${config.websiteVersion}`);
    
    // Upload all content in single request
    const uploadResult = await uploadAllContent(contentPath, config);
    result.uploaded = uploadResult.uploaded;
    result.errors = uploadResult.errors;
    result.success = uploadResult.success;
    
  } catch (error) {
    result.success = false;
    result.errors.push(`Upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return result;
}

/**
 * Upload all content in one request
 */
async function uploadAllContent(contentPath: string, config: UploadConfig): Promise<UploadResult> {
  const result: UploadResult = { success: true, uploaded: 0, errors: [] };
  
  try {
    // Read all content files
    const contentData = await readAllContentFiles(contentPath);
    
    const response = await fetch(`${config.apiUrl}/api/scripts/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: config.username,
        websiteVersion: config.websiteVersion,
        content: contentData
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const uploadResult = await response.json();
    result.uploaded = uploadResult.filesProcessed || 0;
    
    console.log(`✅ Successfully uploaded ${result.uploaded} files to ${config.environment.toUpperCase()}`);
    
  } catch (error) {
    result.success = false;
    result.errors.push(`Upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return result;
}

/**
 * Read all content files into structured format
 */
async function readAllContentFiles(contentPath: string) {
  const contentData: any = {};
  
  // First, try to read config and design files from parent directories
  const baseDir = path.dirname(contentPath);
  
  // Read config.json from config/ folder
  try {
    const configPath = path.join(baseDir, 'config', 'config.json');
    const configContent = await fs.readFile(configPath, 'utf8');
    contentData.config = JSON.parse(configContent);
    console.log('✅ Found and loaded config.json');
  } catch (error) {
    console.log('ℹ️  No config.json found, skipping...');
  }
  
  // Read design.json from design/ folder
  try {
    const designPath = path.join(baseDir, 'design', 'design.json');
    const designContent = await fs.readFile(designPath, 'utf8');
    contentData.design = JSON.parse(designContent);
    console.log('✅ Found and loaded design.json');
  } catch (error) {
    console.log('ℹ️  No design.json found, skipping...');
  }
  
  // Read locale-based content files
  const locales = await fs.readdir(contentPath);
  
  for (const locale of locales) {
    const localePath = path.join(contentPath, locale);
    const stat = await fs.stat(localePath);
    if (!stat.isDirectory()) continue;
    
    contentData[locale] = {};
    
    const files = await fs.readdir(localePath);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(localePath, file);
      const content = await fs.readFile(filePath, 'utf8');
      const fileKey = path.basename(file, '.json');
      
      contentData[locale][fileKey] = JSON.parse(content);
    }
  }
  
  return contentData;
}



/**
 * Main function - validate and upload content
 */
export async function runValidateAndUpload(contentPath?: string): Promise<void> {
  const defaultPath = path.join(process.cwd(), 'public', 'content');
  const pathToValidate = contentPath || defaultPath;
  
  // Parse upload configuration
  const uploadConfig = parseUploadArgs();
  
  if (!uploadConfig) {
    console.log('ℹ️  No upload configuration provided. Running validation only.');
    
    try {
      const { runJsonStructureValidation } = await import('./validateJsonStructure');
      await runJsonStructureValidation(pathToValidate);
    } catch (error) {
      console.log('⚠️ Structure validation not available');
    }
    
    try {
      const { runContentValidation } = await import('./validateContent');
      await runContentValidation(pathToValidate);
    } catch (error) {
      console.log('⚠️ Content validation not available');
    }
    
    return;
  }
  
  console.log(`🔍 Validating and uploading content to ${uploadConfig.environment.toUpperCase()}`);
  console.log(`   Target: ${uploadConfig.username}/${uploadConfig.websiteVersion}`);
  console.log(`   API: ${uploadConfig.apiUrl}`);
  
  // 1. Run validation first
  console.log('\n📊 Step 1: Validating JSON structure...');
  
  try {
    const { validateJsonStructure } = await import('./validateJsonStructure');
    const structureResult = await validateJsonStructure(pathToValidate);
    
    if (!structureResult.isValid) {
      console.log('\n❌ Validation failed! Cannot upload invalid content.');
      structureResult.errors.forEach(error => console.log(`   ${error}`));
      process.exit(1);
    }
    
    console.log('✅ JSON structure validation passed!');
  } catch (error) {
    console.log('\n⚠️ Structure validation script not found, skipping...');
  }
  
  console.log('\n📊 Step 2: Validating content rules...');
  
  try {
    const { runContentValidation } = await import('./validateContent');
    await runContentValidation(pathToValidate);
    console.log('✅ Content validation passed!');
  } catch (error) {
    console.log('\n⚠️ Content validation script not found, skipping...');
  }
  
  // 2. Upload to database
  console.log('\n📊 Step 3: Uploading to database...');
  const uploadResult = await uploadContentToDatabase(pathToValidate, uploadConfig);
  
  console.log(`\n📊 Upload completed:`);
  console.log(`   Files uploaded: ${uploadResult.uploaded}`);
  console.log(`   Errors: ${uploadResult.errors.length}`);
  
  if (uploadResult.errors.length > 0) {
    console.log('\n⚠️  UPLOAD ERRORS:');
    uploadResult.errors.forEach(error => console.log(`   ${error}`));
  }
  
  if (!uploadResult.success) {
    console.log('\n💥 Upload failed!');
    process.exit(1);
  }
  
  console.log(`\n✅ Successfully uploaded ${uploadResult.uploaded} files to ${uploadConfig.environment.toUpperCase()}!`);
}

// Make it runnable from command line
if (typeof require !== 'undefined' && require.main === module) {
  const contentPath = process.argv[3]; // Skip upload:env:user:version arg
  runValidateAndUpload(contentPath).catch(console.error);
}