import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export interface CategoryOption {
  label: string;
  count?: number;
  value: string;
}

export interface CategoryGroup {
  title: string;
  options: CategoryOption[];
  multiSelect?: boolean;
}

export interface CategoryFilterProps {
  categories: CategoryGroup[];
  selectedFilters?: Record<string, string[]>;
  onFilterChange?: (filters: Record<string, string[]>) => void;
  className?: string;
  defaultExpanded?: boolean;
}

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string | undefined | null): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function CategoryFilter({ 
  categories = [], 
  selectedFilters: externalSelectedFilters,
  onFilterChange,
  className = '',
  defaultExpanded = false
}: CategoryFilterProps) {
  // Use external selectedFilters if provided, otherwise maintain internal state
  const [internalSelectedFilters, setInternalSelectedFilters] = useState<Record<string, string[]>>({});
  const selectedFilters = externalSelectedFilters !== undefined ? externalSelectedFilters : internalSelectedFilters;
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Initialize expandedSections based on categories, and update when categories change
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    return (categories || []).reduce((acc, cat) => ({ ...acc, [cat.title]: defaultExpanded }), {});
  });

  // Update expandedSections when categories change
  useEffect(() => {
    if (categories && categories.length > 0) {
      setExpandedSections(prev => {
        const newSections = { ...prev };
        categories.forEach(cat => {
          if (!(cat.title in newSections)) {
            newSections[cat.title] = defaultExpanded;
          }
        });
        return newSections;
      });
    }
  }, [categories, defaultExpanded]);

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleFilterChange = (groupTitle: string, value: string, multiSelect: boolean = false) => {
    const current = selectedFilters[groupTitle] || [];
    let updated: string[];

    if (multiSelect) {
      updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
    } else {
      updated = current.includes(value) ? [] : [value];
    }

    const newFilters = {
      ...selectedFilters,
      [groupTitle]: updated
    };

    // Update internal state if not using external state
    if (externalSelectedFilters === undefined) {
      setInternalSelectedFilters(newFilters);
    }
    
    // Always call the callback to notify parent
    onFilterChange?.(newFilters);
  };

  // Filter categories and options based on search query
  // Optimized for large arrays (e.g., many brands)
  const filteredCategories = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    // If no search query, return all categories
    if (!trimmedQuery) {
      return categories;
    }

    // Normalize query once
    const normalizedQuery = trimmedQuery.toLowerCase();
    
    // Filter categories and their options in a single pass
    const result = categories
      .map(category => {
        // Filter options that match the query substring
        const filteredOptions = category.options.filter(option => {
          // Normalize label once and check if it includes the query
          return option.label.toLowerCase().includes(normalizedQuery);
        });
        
        // Only include category if it has matching options
        if (filteredOptions.length === 0) {
          return null;
        }
        
        return {
          ...category,
          options: filteredOptions
        };
      })
      .filter((category): category is CategoryGroup => category !== null);
    
    return result;
  }, [categories, searchQuery]);

  // Auto-expand categories when searching
  // Reset expansion when search is cleared
  // Use useLayoutEffect for synchronous updates before browser paint
  // This fixes the issue where first keystroke doesn't show results for large arrays (2000+ brands)
  useLayoutEffect(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery && filteredCategories.length > 0) {
      // Expand all categories that have matching results synchronously (before paint)
      setExpandedSections(prev => {
        const newSections = { ...prev };
        let hasChanges = false;
        
        filteredCategories.forEach(cat => {
          if (!newSections[cat.title]) {
            newSections[cat.title] = true;
            hasChanges = true;
          }
        });
        
        // Only update if there are actual changes to prevent unnecessary re-renders
        return hasChanges ? newSections : prev;
      });
    } else if (!trimmedQuery) {
      // Reset to default expanded state when search is cleared
      const defaultSections = (categories || []).reduce((acc, cat) => ({ ...acc, [cat.title]: defaultExpanded }), {});
      setExpandedSections(defaultSections);
    }
  }, [searchQuery, filteredCategories, categories, defaultExpanded]);

  // Don't render if no categories
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Input - Sticky at top */}
      <div className="sticky top-0 z-10 bg-white pb-4 -mb-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search filters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
          />
        </div>
      </div>

      {filteredCategories.length === 0 && searchQuery.trim() ? (
        <div className="text-sm text-gray-500 py-4 text-center">
          No filters found matching "{searchQuery}"
        </div>
      ) : (
        filteredCategories.map((category) => (
        <div key={category.title} className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection(category.title)}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="uppercase tracking-wide text-sm">{category.title}</span>
            {expandedSections[category.title] ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {expandedSections[category.title] && category.options.length > 0 && (
            <div className="mt-2 overflow-hidden">
              <div 
                className="space-y-2 overflow-y-auto pr-2"
                style={{ 
                  maxHeight: '300px',
                  scrollbarWidth: 'thin',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {category.options.map((option) => {
                  const isSelected = (selectedFilters[category.title] || []).includes(option.value);
                  
                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-x-10 cursor-pointer hover:text-black transition-colors py-1 min-h-[32px]"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleFilterChange(category.title, option.value, category.multiSelect)}
                        className="w-4 h-4 border-gray-300 rounded cursor-pointer flex-shrink-0"
                      />
                      <span className="text-sm md:text-base lg:text-lg flex-1 font-thin text-gray-700"> 
                        {capitalizeFirstLetter(option.label)} 
                        {option.count !== undefined && (
                          <span className="text-gray-400 ml-1 px-2 font-light"> ({option.count})</span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        ))
      )}
    </div>
  );
}
