import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SortOption {
  label: string;
  value: string;
}

export interface SortByProps {
  options: SortOption[];
  defaultValue?: string;
  onSortChange?: (value: string) => void;
  className?: string;
  label?: string;
}

export function SortBy({ 
  options, 
  defaultValue,
  onSortChange,
  className = '',
  label = 'Sort by'
}: SortByProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    onSortChange?.(value);
  };

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-sm"
      >
        <span className="uppercase tracking-wide text-xs">{label}:</span>
        <span>{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 shadow-lg z-20 min-w-[200px]">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  option.value === selectedValue ? 'bg-gray-50' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

