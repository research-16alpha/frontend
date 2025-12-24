import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchFilterMetadata } from '../../features/products/services/metadataService';
import { CategoryGroup } from '../../features/products/components/CategoryFilter';
import { SortOption } from '../../features/products/components/SortBy';

interface FilterMetadataContextType {
  categoryData: CategoryGroup[];
  sortOptions: SortOption[];
  loading: boolean;
  error: string | null;
  refreshMetadata: () => Promise<void>;
}

const FilterMetadataContext = createContext<FilterMetadataContextType | undefined>(undefined);

export function FilterMetadataProvider({ children }: { children: ReactNode }) {
  const [categoryData, setCategoryData] = useState<CategoryGroup[]>([]);
  const [sortOptions, setSortOptions] = useState<SortOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFilterMetadata = async () => {
    try {
      setLoading(true);
      setError(null);
      const metadata = await fetchFilterMetadata();
      console.log('FilterMetadataContext: Received metadata', metadata);
      
      // Ensure we have arrays
      const categories = Array.isArray(metadata.categories) ? metadata.categories : [];
      const sortOptions = Array.isArray(metadata.sortOptions) ? metadata.sortOptions : [];
      
      console.log('FilterMetadataContext: Setting categories', categories.length, 'sortOptions', sortOptions.length);
      setCategoryData(categories);
      setSortOptions(sortOptions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load filter metadata';
      setError(errorMessage);
      console.error('Error loading filter metadata:', err);
      // Set empty arrays on error to prevent components from breaking
      setCategoryData([]);
      setSortOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilterMetadata();
  }, []);

  return (
    <FilterMetadataContext.Provider
      value={{
        categoryData,
        sortOptions,
        loading,
        error,
        refreshMetadata: loadFilterMetadata,
      }}
    >
      {children}
    </FilterMetadataContext.Provider>
  );
}

export function useFilterMetadata() {
  const context = useContext(FilterMetadataContext);
  if (context === undefined) {
    throw new Error('useFilterMetadata must be used within a FilterMetadataProvider');
  }
  return context;
}

