'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent } from '../../patterns/cookieConsent/ConsentProvider';

// ===== TYPES =====

export interface AnalyticsSession {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
}

export interface AnalyticsEvent {
  type: 'pageview' | 'event' | 'conversion';
  path?: string;
  event?: string;
  data?: Record<string, any>;
  timestamp: number;
}

export interface AnalyticsContextType {
  session: AnalyticsSession | null;
  isEnabled: boolean;
  trackPageView: (path: string, title?: string) => void;
  trackEvent: (event: string, data?: Record<string, any>) => void;
  trackConversion: (type: string, value?: number, data?: Record<string, any>) => void;
}

// ===== CONSTANTS =====

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_STORAGE_KEY = 'blimpify_analytics_session';

// ===== CONTEXT =====

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);
  if (!context) {
    // Return safe defaults for SSR or when provider is missing
    return {
      session: null,
      isEnabled: false,
      trackPageView: () => {},
      trackEvent: () => {},
      trackConversion: () => {},
    };
  }
  return context;
}

// ===== HELPER FUNCTIONS =====

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getStoredSession(): AnalyticsSession | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    
    const session: AnalyticsSession = JSON.parse(stored);
    const now = Date.now();
    
    // Check if session expired
    if (now - session.lastActivity > SESSION_TIMEOUT) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    
    return session;
  } catch (error) {
    console.warn('[Analytics] Could not read stored session:', error);
    return null;
  }
}

function saveSession(session: AnalyticsSession): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn('[Analytics] Could not save session:', error);
  }
}

function getApiEndpoint(): string {
  // Try to use API_URL from environment
  if (typeof window !== 'undefined' && (window as any).__BLIMPIFY_API_URL__) {
    return `${(window as any).__BLIMPIFY_API_URL__}/api/v1/analytics/track`;
  }
  
  // Fallback: send to same origin (will work with proxy or same domain)
  return '/api/v1/analytics/track';
}

async function sendEvent(event: AnalyticsEvent, session: AnalyticsSession): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const endpoint = getApiEndpoint();
    const payload = {
      ...event,
      sessionId: session.sessionId,
      host: window.location.host,
    };

    // Use sendBeacon if available (best for page unload scenarios)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      // Fallback to fetch
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(err => {
        console.debug('[Analytics] Failed to send event:', err);
      });
    }
  } catch (error) {
    console.debug('[Analytics] Error sending event:', error);
  }
}

// ===== COMPONENT =====

interface AnalyticsProps {
  children: ReactNode;
}

export function Analytics({ children }: AnalyticsProps) {
  const pathname = usePathname();
  const { consent, hasResponded, isLoading: consentLoading } = useConsent();
  const [session, setSession] = useState<AnalyticsSession | null>(null);
  const [hasTrackedInitialPage, setHasTrackedInitialPage] = useState(false);

  // Initialize or restore session
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (consentLoading) return;
    
    // Only initialize if user has responded to consent
    if (!hasResponded) return;
    
    // Only track if analytics consent is given
    if (!consent.analytics) {
      // Clear any existing session
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      setSession(null);
      return;
    }

    // Try to restore existing session
    let currentSession = getStoredSession();
    
    if (!currentSession) {
      // Create new session
      currentSession = {
        sessionId: generateSessionId(),
        startTime: Date.now(),
        lastActivity: Date.now(),
        pageViews: 0,
      };
    } else {
      // Update activity timestamp
      currentSession.lastActivity = Date.now();
    }
    
    setSession(currentSession);
    saveSession(currentSession);
  }, [consent.analytics, hasResponded, consentLoading]);

  // Update activity on user interaction
  useEffect(() => {
    if (!session || !consent.analytics) return;
    
    const updateActivity = () => {
      const updatedSession = {
        ...session,
        lastActivity: Date.now(),
      };
      setSession(updatedSession);
      saveSession(updatedSession);
    };

    // Throttle updates to max once per 5 seconds
    let lastUpdate = Date.now();
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > 5000) {
        lastUpdate = now;
        updateActivity();
      }
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [session, consent.analytics]);

  const trackPageView = useCallback((path: string, title?: string) => {
    if (!session || !consent.analytics) return;

    const updatedSession = {
      ...session,
      pageViews: session.pageViews + 1,
      lastActivity: Date.now(),
    };
    
    setSession(updatedSession);
    saveSession(updatedSession);

    const event: AnalyticsEvent = {
      type: 'pageview',
      path,
      data: { title, referrer: typeof document !== 'undefined' ? document.referrer : undefined },
      timestamp: Date.now(),
    };

    sendEvent(event, updatedSession);
  }, [session, consent.analytics]);

  const trackEvent = useCallback((event: string, data?: Record<string, any>) => {
    if (!session || !consent.analytics) return;

    const analyticsEvent: AnalyticsEvent = {
      type: 'event',
      event,
      data,
      timestamp: Date.now(),
    };

    sendEvent(analyticsEvent, session);
  }, [session, consent.analytics]);

  const trackConversion = useCallback((type: string, value?: number, data?: Record<string, any>) => {
    if (!session || !consent.analytics) return;

    const event: AnalyticsEvent = {
      type: 'conversion',
      event: type,
      data: { ...data, value },
      timestamp: Date.now(),
    };

    sendEvent(event, session);
  }, [session, consent.analytics]);

  const isEnabled = !!session && consent.analytics && hasResponded;

  // Auto-track page views on route change
  useEffect(() => {
    if (!isEnabled) return;
    
    // Skip tracking on initial mount to avoid interfering with redirects
    // Only track after first render or when pathname actually changes
    if (!hasTrackedInitialPage) {
      setHasTrackedInitialPage(true);
      // Only track if we're not on root (which would redirect anyway)
      if (pathname !== '/') {
        const title = typeof document !== 'undefined' ? document.title : undefined;
        trackPageView(pathname, title);
      }
      return;
    }
    
    // Track subsequent page views
    const title = typeof document !== 'undefined' ? document.title : undefined;
    trackPageView(pathname, title);
  }, [pathname, isEnabled, trackPageView, hasTrackedInitialPage]);

  return (
    <AnalyticsContext.Provider
      value={{
        session,
        isEnabled,
        trackPageView,
        trackEvent,
        trackConversion,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
