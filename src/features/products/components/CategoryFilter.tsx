import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  onFilterChange?: (filters: Record<string, string[]>) => void;
  className?: string;
  defaultExpanded?: boolean;
}

export function CategoryFilter({ 
  categories, 
  onFilterChange,
  className = '',
  defaultExpanded = false
}: CategoryFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.title]: defaultExpanded }), {})
  );

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleFilterChange = (groupTitle: string, value: string, multiSelect: boolean = false) => {
    setSelectedFilters(prev => {
      const current = prev[groupTitle] || [];
      let updated: string[];

      if (multiSelect) {
        updated = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];
      } else {
        updated = current.includes(value) ? [] : [value];
      }

      const newFilters = {
        ...prev,
        [groupTitle]: updated
      };

      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {categories.map((category) => (
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

          {expandedSections[category.title] && (
            <div className="space-y-2">
              {category.options.map((option) => {
                const isSelected = (selectedFilters[category.title] || []).includes(option.value);
                
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-x-3 cursor-pointer hover:text-gray-600 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleFilterChange(category.title, option.value, category.multiSelect)}
                      className="w-4 h-4 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-sm flex-1 font-light text-gray-500" > 
                      
                      {option.label} 
                      {option.count !== undefined && (
                        <span className="text-gray-400 ml-1 px-2 font-light"> ({option.count})</span>
                      )}
                    </span>

                    
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
