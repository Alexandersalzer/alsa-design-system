// ===============================================
// Page Transition Component
// Provides smooth page transitions with loading states
// ===============================================

import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { LoadingPage, LoadingSkeleton } from '../../../patterns/shared/EmptyState/LoadingSkeleton';

export interface PageTransitionProps {
  children: ReactNode;
  loadingVariant?: 'dashboard' | 'list' | 'detail';
  transitionDuration?: number;
  showLoadingState?: boolean;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  loadingVariant = 'dashboard',
  transitionDuration = 200,
  showLoadingState = true,
  className = ''
}) => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPath, setCurrentPath] = useState(router.pathname);
  const [showContent, setShowContent] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsTransitioning(true);
      if (showLoadingState) {
        setShowContent(false);
      }
    };

    const handleRouteChangeComplete = () => {
      setCurrentPath(router.pathname);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Delay to ensure smooth transition
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setShowContent(true);
      }, transitionDuration);
    };

    const handleRouteChangeError = () => {
      setIsTransitioning(false);
      setShowContent(true);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [router, transitionDuration, showLoadingState]);

  const containerClasses = [
    'page-transition',
    isTransitioning && 'page-transition--transitioning',
    showContent && 'page-transition--visible',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {isTransitioning && showLoadingState && !showContent ? (
        <div className="page-transition__loading">
          <LoadingPage variant={loadingVariant} />
        </div>
      ) : (
        <div 
          key={currentPath}
          className="page-transition__content"
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Route progress indicator component
export const RouteProgress: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    const handleError = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  if (!isLoading) return null;

  return (
    <div className={`route-progress ${className}`}>
      <div className="route-progress__bar" />
    </div>
  );
};

// Quick loading overlay for specific sections
export interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  loadingText?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  loadingText = 'Laddar...',
  className = ''
}) => {
  const overlayClasses = [
    'loading-overlay',
    isLoading && 'loading-overlay--active',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={overlayClasses}>
      {children}
      {isLoading && (
        <div className="loading-overlay__content">
          <div className="loading-overlay__spinner">
            <LoadingSkeleton 
              width="24px" 
              height="24px" 
              variant="circular"
              animated={true}
            />
          </div>
          {loadingText && (
            <div className="loading-overlay__text">
              {loadingText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
