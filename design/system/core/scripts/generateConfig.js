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
      return [];
    }
    
    const data = await response.json();
    
    if (!data.success) {
      return [];
    }
    
    return data.applications.active;
    
  } catch (error) {
    return [];
  }
}

/**
 * Fetch marketing pixels from API
 */
async function fetchMarketingPixels(externalId) {
  try {
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
      return [];
    }
    
    const data = await response.json();
    
    if (!data.success) {
      return [];
    }
    
    return data.pixels || [];
    
  } catch (error) {
    return [];
  }
}

/**
 * Fetch localization settings from API
 */
async function fetchLocalization(externalId) {
  try {
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
      return { default_iso_code: 'sv' };
    }
    
    const data = await response.json();
    
    if (!data.success) {
      return { default_iso_code: 'sv' };
    }
    
    return data.localization || { default_iso_code: 'sv' };
    
  } catch (error) {
    return { default_iso_code: 'sv' };
  }
}

/**
 * Fetch SEO and business configuration from API
 */
async function fetchSEOConfig(externalId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/public/user/${externalId}/seo-config`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Blimpify-Config-Generator/1.0'
        }
      }
    );
    
    if (!response.ok) {
      return { seo: null, business: null };
    }
    
    const data = await response.json();
    
    if (!data.success) {
      return { seo: null, business: null };
    }
    
    return { seo: data.seo, business: data.business };
    
  } catch (error) {
    return { seo: null, business: null };
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
      return ['sv'];
    }
    
    const entries = fs.readdirSync(contentDir, { withFileTypes: true });
    const locales = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => /^[a-z]{2}(-[A-Z]{2})?$/.test(name));
    
    if (locales.length === 0) {
      return ['sv'];
    }
    
    return locales;
    
  } catch (error) {
    return ['sv'];
  }
}

/**
 * Main config generation function
 */
async function generateConfig() {
  // Validate environment variables
  if (!EXTERNAL_ID) {
    console.error('❌ NEXT_PUBLIC_EXTERNAL_ID environment variable is required!');
    process.exit(1);
  }
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(EXTERNAL_ID)) {
    console.error('❌ Invalid NEXT_PUBLIC_EXTERNAL_ID format (must be UUID)');
    process.exit(1);
  }
  
  // Fetch data from API
  const activeApplications = await fetchActiveApplications(EXTERNAL_ID);
  const marketingPixels = await fetchMarketingPixels(EXTERNAL_ID);
  const localization = await fetchLocalization(EXTERNAL_ID);
  const seoConfig = await fetchSEOConfig(EXTERNAL_ID);
  
  // Detect available locales from content directory
  const availableLocales = detectAvailableLocales();
  
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
  
  // Add SEO and business config if available
  if (seoConfig.seo) {
    config.seo = seoConfig.seo;
  }
  
  if (seoConfig.business) {
    config.business = seoConfig.business;
  }
  
  // Write config.json
  const projectRoot = process.cwd();
  const configDir = path.join(projectRoot, 'public', 'config');
  const configPath = path.join(configDir, 'config.json');
  
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
}

// Run script
generateConfig().catch(error => {
  console.error('❌ Config generation failed:', error.message);
  process.exit(1);
});
