// ===============================================
// FilterContext.tsx
// Context for category-based filtering (portfolios, galleries, etc.)
// Enables Tab and Grid components to be filter-aware without new layout types
// ===============================================

'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// ===============================================
// TYPES
// ===============================================

interface Category {
  id: string;
  /** Item IDs - can be array of IDs or "*" for all items */
  itemIds: string[] | '*';
  [key: string]: any;
}

interface FilterContextValue {
  /** Currently active category ID */
  activeCategoryId: string;
  /** Set active category by ID */
  setActiveCategoryId: (id: string) => void;
  /** Item IDs that belong to the active category */
  filteredItemIds: string[];
  /** All categories for reference */
  categories: Category[];
}

const FilterContext = createContext<FilterContextValue | null>(null);

// ===============================================
// HOOK
// ===============================================

/**
 * Hook to access filter context
 * Returns null if not within a FilterProvider (component not in filter mode)
 */
export const useFilterContext = (): FilterContextValue | null => {
  return useContext(FilterContext);
};

// ===============================================
// PROVIDER
// ===============================================

interface FilterProviderProps {
  children: ReactNode;
  /** Categories array from layout (each with id and itemIds) */
  categories: Category[];
  /** All item IDs from layout (for wildcard "*" support) */
  allItemIds?: string[];
  /** Initial active category ID (defaults to first category) */
  defaultCategoryId?: string;
}

/**
 * FilterProvider wraps layouts that need category-based filtering
 * Provides state management for active category and filtered item IDs
 * Supports wildcard "*" in itemIds to mean "all items"
 */
export const FilterProvider: React.FC<FilterProviderProps> = ({
  children,
  categories,
  allItemIds = [],
  defaultCategoryId
}) => {
  // Default to first category if not specified
  const initialCategoryId = defaultCategoryId || categories[0]?.id || '';
  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialCategoryId);

  // Compute filtered item IDs based on active category
  // Supports wildcard "*" to mean all items
  const filteredItemIds = useMemo(() => {
    const activeCategory = categories.find(c => c.id === activeCategoryId);
    if (!activeCategory) return [];
    
    // Check for wildcard - either "*" string or array with "*"
    const itemIds = activeCategory.itemIds;
    if (itemIds === '*' || (Array.isArray(itemIds) && itemIds.length === 1 && itemIds[0] === '*')) {
      return allItemIds;
    }
    
    return itemIds || [];
  }, [categories, activeCategoryId, allItemIds]);

  const value = useMemo<FilterContextValue>(() => ({
    activeCategoryId,
    setActiveCategoryId,
    filteredItemIds,
    categories
  }), [activeCategoryId, filteredItemIds, categories]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
