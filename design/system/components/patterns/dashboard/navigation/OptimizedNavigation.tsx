// ===============================================
// Optimized Navigation Component for Dashboard
// Provides smooth navigation with loading states and preloading
// ===============================================

import React, { ReactNode, useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Tab, TabGroup } from '../../../primitives/NavigationTab';
import { LoadingSkeleton, LoadingList } from '../../../patterns/shared/EmptyState/LoadingSkeleton';
import { Icon } from '../../../primitives/Icon';

export interface OptimizedNavigationItem {
  href: string;
  label: string;
  icon: React.ReactElement;
  badge?: ReactNode;
  preload?: boolean; // Whether to preload this route
  priority?: 'high' | 'medium' | 'low'; // Preload priority
}

export interface OptimizedNavigationProps {
  items: OptimizedNavigationItem[];
  variant?: 'sidebar' | 'top';
  showLoadingStates?: boolean;
  preloadDelay?: number; // Delay before preloading (ms)
  className?: string;
}

export const OptimizedNavigation: React.FC<OptimizedNavigationProps> = ({
  items,
  variant = 'sidebar',
  showLoadingStates = true,
  preloadDelay = 200,
  className = ''
}) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [preloadedRoutes, setPreloadedRoutes] = useState<Set<string>>(new Set());

  // Debounced navigation to prevent spam clicking
  const debouncedNavigate = useCallback(
    (href: string) => {
      if (isNavigating || router.pathname === href) return;
      
      setIsNavigating(true);
      setNavigatingTo(href);
      
      // Small delay to show loading state
      setTimeout(() => {
        router.push(href).finally(() => {
          setIsNavigating(false);
          setNavigatingTo(null);
        });
      }, 50);
    },
    [router, isNavigating]
  );

  // Preload routes based on priority
  const preloadRoute = useCallback(
    (href: string) => {
      if (preloadedRoutes.has(href)) return;
      
      // Use Next.js router.prefetch for preloading
      router.prefetch(href);
      setPreloadedRoutes(prev => new Set(prev).add(href));
    },
    [router, preloadedRoutes]
  );

  // Preload high priority routes on mount
  useEffect(() => {
    const highPriorityRoutes = items
      .filter(item => item.preload && item.priority === 'high')
      .map(item => item.href);
    
    highPriorityRoutes.forEach(href => {
      setTimeout(() => preloadRoute(href), preloadDelay);
    });
  }, [items, preloadDelay, preloadRoute]);

  // Preload medium priority routes after a delay
  useEffect(() => {
    const mediumPriorityRoutes = items
      .filter(item => item.preload && item.priority === 'medium')
      .map(item => item.href);
    
    const timer = setTimeout(() => {
      mediumPriorityRoutes.forEach(href => preloadRoute(href));
    }, preloadDelay * 2);

    return () => clearTimeout(timer);
  }, [items, preloadDelay, preloadRoute]);

  // Check if route is active
  const isActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return router.pathname === "/";
      }
      return router.pathname === href || (
        href !== "/" && 
        router.pathname.startsWith(href) && 
        href !== "/admin/project-management"
      );
    },
    [router.pathname]
  );

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(() => {
    return items.map((item) => {
      const isItemActive = isActive(item.href);
      const isItemNavigating = navigatingTo === item.href;
      
      return (
        <Tab
          key={item.href}
          variant="navigation"
          isActive={isItemActive}
          isDisabled={isNavigating}
          onClick={() => {
            // Preload if not already preloaded
            if (item.preload && !preloadedRoutes.has(item.href)) {
              preloadRoute(item.href);
            }
            debouncedNavigate(item.href);
          }}
          icon={
            isItemNavigating && showLoadingStates ? (
              <LoadingSkeleton 
                width="20px" 
                height="20px" 
                variant="circular"
                animated={true}
              />
            ) : (
              <Icon 
                size="lg" 
                color={isItemActive ? 'nav-item-selected' : 'nav-item'}
                weight="medium"
              >
                {item.icon}
              </Icon>
            )
          }
          badge={item.badge}
        >
          {isItemNavigating && showLoadingStates ? (
            <LoadingSkeleton 
              width="80px" 
              height="16px" 
              animated={true}
            />
          ) : (
            item.label
          )}
        </Tab>
      );
    });
  }, [items, isActive, isNavigating, navigatingTo, showLoadingStates, preloadedRoutes, debouncedNavigate, preloadRoute]);

  const containerClasses = [
    'optimized-navigation',
    `optimized-navigation--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <TabGroup variant="navigation" className="optimized-navigation__tabs">
        {navigationItems}
      </TabGroup>
    </div>
  );
};

// Hook for managing navigation state
export const useOptimizedNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  const navigate = useCallback(
    (href: string, router: any) => {
      if (isNavigating) return;
      
      setIsNavigating(true);
      setNavigationHistory(prev => [...prev, href]);
      
      return router.push(href).finally(() => {
        setIsNavigating(false);
      });
    },
    [isNavigating]
  );

  const goBack = useCallback(
    (router: any) => {
      if (navigationHistory.length > 1) {
        const previousRoute = navigationHistory[navigationHistory.length - 2];
        setNavigationHistory(prev => prev.slice(0, -1));
        return router.push(previousRoute);
      }
      return router.back();
    },
    [navigationHistory]
  );

  return {
    isNavigating,
    navigate,
    goBack,
    navigationHistory
  };
};
