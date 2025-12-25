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
 * Fetch marketing pixels from API
 */
async function fetchMarketingPixels(externalId) {
  try {
    console.log(`   Fetching from: ${API_BASE_URL}/api/public/user/${externalId}/marketing-pixels`);
    
    const response = await fetch(
      `${API_BASE_URL}/api/public/user/${externalId}/marketing-pixels`,
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
    
    return data.pixels || [];
    
  } catch (error) {
    console.error(`   ❌ Error fetching marketing pixels: ${error.message}`);
    console.warn('   ⚠️  Continuing with empty pixels array');
    return [];
  }
}

/**
 * Fetch localization settings from API
 */
async function fetchLocalization(externalId) {
  try {
    console.log(`   Fetching from: ${API_BASE_URL}/api/public/user/${externalId}/localization`);
    
    const response = await fetch(
      `${API_BASE_URL}/api/public/user/${externalId}/localization`,
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
      return { default_iso_code: 'sv' };
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.warn('   ⚠️  API returned unsuccessful response');
      return { default_iso_code: 'sv' };
    }
    
    return data.localization || { default_iso_code: 'sv' };
    
  } catch (error) {
    console.error(`   ❌ Error fetching localization: ${error.message}`);
    console.warn('   ⚠️  Continuing with default locale (sv)');
    return { default_iso_code: 'sv' };
  }
}

/**
 * Detect available locales from public/content directory
 */
function detectAvailableLocales() {
  try {
    const projectRoot = process.cwd();
    const contentDir = path.join(projectRoot, 'public', 'content');
    
    if (!fs.existsSync(contentDir)) {
      console.warn('   ⚠️  No content directory found');
      return ['sv']; // Default fallback
    }
    
    const entries = fs.readdirSync(contentDir, { withFileTypes: true });
    const locales = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => /^[a-z]{2}(-[A-Z]{2})?$/.test(name)); // Only valid locale codes (sv, en, en-US, etc.)
    
    if (locales.length === 0) {
      console.warn('   ⚠️  No valid locale directories found');
      return ['sv']; // Default fallback
    }
    
    return locales;
    
  } catch (error) {
    console.error(`   ❌ Error detecting locales: ${error.message}`);
    return ['sv']; // Default fallback
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
  
  // Fetch data from API
  console.log('🌐 Fetching data from API...');
  const activeApplications = await fetchActiveApplications(EXTERNAL_ID);
  const marketingPixels = await fetchMarketingPixels(EXTERNAL_ID);
  const localization = await fetchLocalization(EXTERNAL_ID);
  
  // Detect available locales from content directory
  const availableLocales = detectAvailableLocales();
  
  console.log('');
  if (activeApplications.length > 0) {
    console.log(`   ✅ Found ${activeApplications.length} active application(s):`);
    activeApplications.forEach(app => {
      console.log(`      • ${app}`);
    });
  } else {
    console.log('   ℹ️  No active applications found (only content pages will be generated)');
  }
  
  if (marketingPixels.length > 0) {
    console.log(`   ✅ Found ${marketingPixels.length} marketing pixel(s):`);
    marketingPixels.forEach(pixel => {
      console.log(`      • ${pixel.platform}: ${pixel.pixel_id}`);
    });
  } else {
    console.log('   ℹ️  No marketing pixels configured');
  }
  
  console.log(`   ✅ Default locale: ${localization.default_iso_code}`);
  console.log(`   ✅ Available locales: ${availableLocales.join(', ')}`);
  console.log('');
  
  // Build config object
  const config = {
    version: '1.0',
    user: {
      external_id: EXTERNAL_ID
    },
    localization: {
      default_iso_code: localization.default_iso_code,
      available_locales: availableLocales
    },
    applications: {
      active: activeApplications
    },
    marketing: {
      pixels: marketingPixels
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
    console.log(marketingPixels.length > 0 ? `   ✅ Marketing pixels: ${marketingPixels.length}` : '   ℹ️  Marketing pixels: None');
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
