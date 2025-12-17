/**
 * generateConfig.js - Dynamic Config Generation Script
 * 
 * Generates public/config/config.json at build time by:
 * 1. Reading NEXT_PUBLIC_EXTERNAL_ID from environment
 * 2. Fetching active applications from API
 * 3. Writing config.json with external_id + active applications
 * 
 * This config is used by Next.js generateStaticParams() to determine
 * which pages to generate (content pages + application pages).
 * 
 * @author Blimpify
 * @since 2025-12-11
 */

const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_URL || 'https://devapi.blimpify-im.com';
const EXTERNAL_ID = process.env.NEXT_PUBLIC_EXTERNAL_ID;

/**
 * Fetch active applications from API
 */
async function fetchActiveApplications(externalId) {
  try {
    console.log(`   Fetching from: ${API_BASE_URL}/api/public/user/${externalId}/active-applications`);
    
    const response = await fetch(
      `${API_BASE_URL}/api/public/user/${externalId}/active-applications`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Blimpify-Config-Generator/1.0'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn('   ⚠️  User not found in API');
      } else if (response.status === 429) {
        console.warn('   ⚠️  Rate limit exceeded');
      } else {
        console.warn(`   ⚠️  API responded with status ${response.status}`);
      }
      return [];
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.warn('   ⚠️  API returned unsuccessful response');
      return [];
    }
    
    return data.applications.active;
    
  } catch (error) {
    console.error(`   ❌ Error fetching active applications: ${error.message}`);
    console.warn('   ⚠️  Continuing with empty applications array');
    return [];
  }
}

/**
 * Main config generation function
 */
async function generateConfig() {
  console.log('');
  console.log('🔧 Generating config.json...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Validate environment variables
  if (!EXTERNAL_ID) {
    console.error('');
    console.error('❌ NEXT_PUBLIC_EXTERNAL_ID environment variable is required!');
    console.error('   This should be set as a GitHub secret.');
    console.error('');
    process.exit(1);
  }
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(EXTERNAL_ID)) {
    console.error('');
    console.error('❌ Invalid NEXT_PUBLIC_EXTERNAL_ID format (must be UUID)');
    console.error(`   Received: ${EXTERNAL_ID}`);
    console.error('');
    process.exit(1);
  }
  
  console.log(`   External ID: ${EXTERNAL_ID}`);
  console.log(`   API URL: ${API_BASE_URL}`);
  console.log('');
  
  // Fetch active applications from API
  console.log('🌐 Fetching active applications from API...');
  const activeApplications = await fetchActiveApplications(EXTERNAL_ID);
  
  console.log('');
  if (activeApplications.length > 0) {
    console.log(`   ✅ Found ${activeApplications.length} active application(s):`);
    activeApplications.forEach(app => {
      console.log(`      • ${app}`);
    });
  } else {
    console.log('   ℹ️  No active applications found (only content pages will be generated)');
  }
  console.log('');
  
  // Build config object
  const config = {
    version: '1.0',
    user: {
      external_id: EXTERNAL_ID
    },
    localization: {
      endonym_name: 'Svenska',
      iso_code: 'sv',
      name: 'Svenska',
      primary: true
    },
    applications: {
      active: activeApplications
    }
  };
  
  // Write config.json
  const projectRoot = process.cwd();
  const configDir = path.join(projectRoot, 'public', 'config');
  const configPath = path.join(configDir, 'config.json');
  
  // Ensure directory exists
  fs.mkdirSync(configDir, { recursive: true });
  
  // Write file
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  
  console.log('📝 Config file written:');
  console.log(`   Path: ${configPath}`);
  console.log(`   Size: ${fs.statSync(configPath).size} bytes`);
  console.log('');
  
  // Check for content directory
  const contentDir = path.join(projectRoot, 'public', 'content');
  const hasContent = fs.existsSync(contentDir) && 
                     fs.readdirSync(contentDir).length > 0;
  
  // Warn if neither content nor applications exist
  if (!hasContent && activeApplications.length === 0) {
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.warn('⚠️  WARNING: No content pages and no active applications!');
    console.warn('   This site will be empty except for the root page.');
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.warn('');
  } else {
    console.log('📊 Build Summary:');
    console.log(hasContent ? '   ✅ Content pages: Available' : '   ℹ️  Content pages: None');
    console.log(activeApplications.length > 0 ? `   ✅ Application pages: ${activeApplications.length}` : '   ℹ️  Application pages: None');
    console.log('');
  }
  
  console.log('✅ Config generation complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

// Run script
generateConfig().catch(error => {
  console.error('');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ Fatal error generating config:');
  console.error('');
  console.error(`   ${error.message}`);
  if (error.stack) {
    console.error('');
    console.error('Stack trace:');
    console.error(error.stack);
  }
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('');
  process.exit(1);
});
