/**
 * Centraliserad cache-lösning för API-anrop (In-Memory Only)
 */

const CACHE_VERSION = 'v2';

class APICache {
  private cache = new Map<string, { data: any; timestamp: number; expiresAt: number; key: string; version: string }>();
  private pendingRequests = new Map<string, Promise<any>>();
  private defaultTTL = 5 * 60 * 1000;
  private maxCacheSize = 100;
  private version = CACHE_VERSION;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('blimpify:invalidateAll', () => {
        try {
          this.clear();
        } catch {
          // ignore
        }
      });

      window.addEventListener('blimpify:invalidateSetupProgress', () => {
        try {
          this.invalidatePattern(/\/dashboard\/client\/setup-progress/);
        } catch {
          // ignore
        }
      });
    }
  }

  private isCurrentVersion(item: { version: string }) {
    return item.version === this.version;
  }

  private generateKey(url: string, params?: any) {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}${paramString}`;
  }

  private isValid(item: { expiresAt: number; version: string }) {
    return Date.now() < item.expiresAt && this.isCurrentVersion(item);
  }

  private cleanup() {
    if (this.cache.size <= this.maxCacheSize) return;
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  async get<T>(url: string, fetcher: () => Promise<T>, options: { ttl?: number; staleWhileRevalidate?: boolean; maxAge?: number } = {}): Promise<T> {
    const key = this.generateKey(url);
    const {
      ttl = this.defaultTTL,
      staleWhileRevalidate = true,
      maxAge = 10 * 60 * 1000
    } = options;

    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    const cached = this.cache.get(key);

    if (cached && this.isValid(cached)) {
      return cached.data;
    }

    if (cached && staleWhileRevalidate && (Date.now() - cached.timestamp) < maxAge) {
      this.pendingRequests.set(key, this.fetchAndCache(key, url, fetcher, ttl));
      return cached.data;
    }

    return this.fetchAndCache(key, url, fetcher, ttl);
  }

  private async fetchAndCache<T>(key: string, url: string, fetcher: () => Promise<T>, ttl: number): Promise<T> {
    try {
      const data = await fetcher();
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
        key,
        version: this.version
      });
      this.cleanup();
      return data;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  invalidate(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keysToDelete: string[] = [];
    for (const key of Array.from(this.cache.keys())) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  invalidatePattern(pattern: RegExp) {
    const keysToDelete: string[] = [];
    for (const key of Array.from(this.cache.keys())) {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      keys: Array.from(this.cache.keys())
    };
  }

  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  clearAll() {
    this.clear();
  }

  hydrateCache() {
    // Empty implementation - cache hydration not needed in browser
  }

  getVersion() {
    return this.version;
  }
}

export const apiCache = new APICache();

export const CACHE_PATTERNS = {
  USER_PROFILE: /\/users\/profile/,
  BILLING_DATA: /\/billing\//,
  SUBSCRIPTION: /\/payments\/billing\/subscription/,
  INVOICES: /\/payments\/billing\/invoices/,
  PURCHASES: /\/payments\/billing\/purchases/,
  PRODUCTS: /\/payments\/products/,
  WEBSITE_DATA: /\/dashboard\/client\/website$/,
  WEBSITE_STATS: /\/dashboard\/client\/analytics\/website-stats/,
  WEBSITE_INFO: /\/dashboard\/client\/website\/info/,
  PROJECT_BUILDER: /\/project-builder\//,
  USER_PRODUCTS: /\/users\/\d+\/products/,
  ORDERS: /\/orders\//,
  SUPPORT_TICKETS: /\/support\/tickets/,
  SUPPORT_CATEGORIES: /\/support\/categories/,
  ADMIN_CLIENTS: /\/users\/clients/,
  ADMIN_WEBSITES: /\/websites$/,
  ADMIN_SUPPORT: /\/support\/admin\/tickets/,
  ADMIN_PROJECT_BUILDER_STATS: /\/admin\/project-builder\/stats/,
  ADMIN_MILESTONES: /\/admin\/stats\/milestones/,
  DOMAINS: /\/domains\//
} as const;

export const CACHE_TTL = {
  USER_PROFILE: 10 * 60 * 1000,
  BILLING_DATA: 5 * 60 * 1000,
  SUBSCRIPTION: 2 * 60 * 1000,
  INVOICES: 10 * 60 * 1000,
  PURCHASES: 10 * 60 * 1000,
  PRODUCTS: 30 * 60 * 1000,
  WEBSITE_DATA: 5 * 60 * 1000,
  WEBSITE_STATS: 2 * 60 * 1000,
  WEBSITE_INFO: 10 * 60 * 1000,
  PROJECT_BUILDER: 5 * 60 * 1000,
  USER_PRODUCTS: 5 * 60 * 1000,
  ORDERS: 2 * 60 * 1000,
  SUPPORT_TICKETS: 1 * 60 * 1000,
  SUPPORT_CATEGORIES: 30 * 60 * 1000,
  ADMIN_CLIENTS: 5 * 60 * 1000,
  ADMIN_WEBSITES: 3 * 60 * 1000,
  ADMIN_SUPPORT: 2 * 60 * 1000,
  ADMIN_PROJECT_BUILDER_STATS: 10 * 60 * 1000,
  ADMIN_MILESTONES: 15 * 60 * 1000,
  DOMAINS: 10 * 60 * 1000,
} as const;
