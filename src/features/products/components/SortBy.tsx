import React, { useState } from 'react';

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
  variant?: 'default' | 'black';
}

export function SortBy({ 
  options, 
  defaultValue,
  onSortChange,
  className = '',
  label = 'Sort by',
  variant = 'default'
}: SortByProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    onSortChange?.(value);
  };

  const selectedOption = options.find(opt => opt.value === selectedValue);

  const buttonClasses = variant === 'black' 
    ? "px-3 py-3 border border-black bg-black text-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center w-full hover:bg-gray-800 transition-colors cursor-pointer"
    : "px-3 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center w-full";

  return (
    <div className={`relative block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        {label}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 min-w-[200px] p-4">
            <div className="space-y-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left text-sm font-light text-gray-500 hover:text-gray-600 transition-colors ${
                    option.value === selectedValue ? 'text-gray-700' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
