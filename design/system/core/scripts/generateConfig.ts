/**
 * generateConfig.ts - Dynamic Config Generation Script
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

import * as fs from 'fs';
import * as path from 'path';

interface ActiveApplication {
  key: string;
  name: string;
  settings?: Record<string, any>;
}

interface Config {
  version: string;
  user: {
    external_id: string;
  };
  localization: {
    endonym_name: string;
    iso_code: string;
    name: string;
    primary: boolean;
  };
  applications: {
    active: ActiveApplication[];
  };
}

interface APIResponse {
  success: boolean;
  external_id: string;
  applications: {
    active: ActiveApplication[];
  };
}

const API_BASE_URL = process.env.API_URL || 'https://devapi.blimpify.com';
const EXTERNAL_ID = process.env.NEXT_PUBLIC_EXTERNAL_ID;

/**
 * Fetch active applications from API
 */
async function fetchActiveApplications(externalId: string): Promise<ActiveApplication[]> {
  try {
    console.log(`   Fetching from: ${API_BASE_URL}/api/dashboard/public/user/${externalId}/active-applications`);
    
    const response = await fetch(
      `${API_BASE_URL}/api/dashboard/public/user/${externalId}/active-applications`,
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
    
    const data: APIResponse = await response.json();
    
    if (!data.success) {
      console.warn('   ⚠️  API returned unsuccessful response');
      return [];
    }
    
    return data.applications.active;
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(`   ❌ Error fetching active applications: ${error.message}`);
    } else {
      console.error('   ❌ Unknown error fetching active applications');
    }
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
      console.log(`      • ${app.name} (${app.key})`);
    });
  } else {
    console.log('   ℹ️  No active applications found (only content pages will be generated)');
  }
  console.log('');
  
  // Build config object
  const config: Config = {
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
  
  // Determine output path (relative to project root)
  const projectRoot = process.cwd();
  const configDir = path.join(projectRoot, 'public', 'config');
  const configPath = path.join(configDir, 'config.json');
  
  // Ensure directory exists
  fs.mkdirSync(configDir, { recursive: true });
  
  // Write config file
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  
  console.log('📝 Config file written:');
  console.log(`   Path: ${configPath}`);
  console.log(`   Size: ${fs.statSync(configPath).size} bytes`);
  console.log('');
  
  // Check for content directory
  const contentDir = path.join(projectRoot, 'public', 'content');
  const hasContent = fs.existsSync(contentDir) && 
                     fs.readdirSync(contentDir).length > 0;
  
  // Warn if no content and no applications
  if (!hasContent && activeApplications.length === 0) {
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.warn('⚠️  WARNING: No content pages and no active applications!');
    console.warn('   This site will be empty except for the root page.');
    console.warn('   Expected at least one of:');
    console.warn('   • Content files in public/content/');
    console.warn('   • Active applications from API');
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.warn('');
  } else {
    console.log('📊 Build Summary:');
    if (hasContent) {
      console.log(`   ✅ Content pages: Available`);
    } else {
      console.log(`   ℹ️  Content pages: None`);
    }
    if (activeApplications.length > 0) {
      console.log(`   ✅ Application pages: ${activeApplications.length}`);
    } else {
      console.log(`   ℹ️  Application pages: None`);
    }
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
  if (error instanceof Error) {
    console.error(`   ${error.message}`);
    if (error.stack) {
      console.error('');
      console.error('Stack trace:');
      console.error(error.stack);
    }
  } else {
    console.error('   Unknown error');
  }
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('');
  process.exit(1);
});
