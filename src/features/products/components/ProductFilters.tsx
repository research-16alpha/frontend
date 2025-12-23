import * as React from 'react';
import { CategoryFilter, CategoryGroup } from './CategoryFilter';
import { SortBy, SortOption } from './SortBy';
import { useIsMobile } from '../../../shared/components/ui/use-mobile';
import { useScrollDetection } from '../hooks/useScrollDetection';

interface ProductFiltersProps {
  categoryData: CategoryGroup[];
  sortOptions: SortOption[];
  selectedFilters: Record<string, string[]>;
  sortBy: string;
  onFilterChange: (filters: Record<string, string[]>) => void;
  onSortChange: (value: string) => void;
}

export function ProductFilters({
  categoryData,
  sortOptions,
  selectedFilters,
  sortBy,
  onFilterChange,
  onSortChange,
}: ProductFiltersProps) {
  const isMobile = useIsMobile();
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [desktopFilterOpen, setDesktopFilterOpen] = React.useState<string | null>(null);
  const topFiltersRef = React.useRef<HTMLDivElement>(null);
  const showFloatingButtons = useScrollDetection({ elementRef: topFiltersRef, enabled: isMobile });

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Filters Section */}
        {isMobile && (
          <div ref={topFiltersRef} className="w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative inline-block w-full">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="px-3 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center w-full cursor-pointer"
                >
                  Filters
                </button>
                {mobileFiltersOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setMobileFiltersOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 max-h-[60vh] overflow-y-auto">
                      {categoryData && categoryData.length > 0 ? (
                        <CategoryFilter 
                          categories={categoryData}
                          selectedFilters={selectedFilters}
                          onFilterChange={onFilterChange}
                          className="p-4"
                        />
                      ) : (
                        <div className="text-sm text-gray-500 p-4">Loading filters...</div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <SortBy
                options={sortOptions}
                defaultValue={sortBy}
                onSortChange={onSortChange}
                label="Sort"
                variant="black"
              />
            </div>
          </div>
        )}

        {/* Desktop: Separate Filter Buttons + Sort Button */}
        <div className="hidden md:flex lg:flex xl:flex xxl:flex w-full items-center gap-4">
          {/* Category Filter Button */}
          <div className="relative flex-1">
            <button
              onClick={() => setDesktopFilterOpen(desktopFilterOpen === 'CATEGORY' ? null : 'CATEGORY')}
              className={`w-full px-4 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center cursor-pointer transition-colors ${
                selectedFilters['CATEGORY'] && selectedFilters['CATEGORY'].length > 0
                  ? 'bg-gray-100'
                  : ''
              }`}
            >
              Category
              {selectedFilters['CATEGORY'] && selectedFilters['CATEGORY'].length > 0 && (
                <span className="ml-2 text-xs">({selectedFilters['CATEGORY'].length})</span>
              )}
            </button>
            {desktopFilterOpen === 'CATEGORY' && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDesktopFilterOpen(null)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="max-h-[60vh] overflow-y-auto">
                    {categoryData && categoryData.length > 0 && categoryData[0] ? (
                      <CategoryFilter 
                        categories={[categoryData[0]]}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                        defaultExpanded={true}
                        className="p-4"
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-4">Loading categories...</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Brand Filter Button */}
          <div className="relative flex-1">
            <button
              onClick={() => setDesktopFilterOpen(desktopFilterOpen === 'BRAND' ? null : 'BRAND')}
              className={`w-full px-4 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center cursor-pointer transition-colors ${
                selectedFilters['BRAND'] && selectedFilters['BRAND'].length > 0
                  ? 'bg-gray-100'
                  : ''
              }`}
            >
              Brand
              {selectedFilters['BRAND'] && selectedFilters['BRAND'].length > 0 && (
                <span className="ml-2 text-xs">({selectedFilters['BRAND'].length})</span>
              )}
            </button>
            {desktopFilterOpen === 'BRAND' && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDesktopFilterOpen(null)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="max-h-[60vh] overflow-y-auto">
                    {categoryData && categoryData.length > 1 && categoryData[1] ? (
                      <CategoryFilter 
                        categories={[categoryData[1]]}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                        defaultExpanded={true}
                        className="p-4"
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-4">Loading brands...</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Occasion Filter Button */}
          <div className="relative flex-1">
            <button
              onClick={() => setDesktopFilterOpen(desktopFilterOpen === 'OCCASION' ? null : 'OCCASION')}
              className={`w-full px-4 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center cursor-pointer transition-colors ${
                selectedFilters['OCCASION'] && selectedFilters['OCCASION'].length > 0
                  ? 'bg-gray-100'
                  : ''
              }`}
            >
              Occasion
              {selectedFilters['OCCASION'] && selectedFilters['OCCASION'].length > 0 && (
                <span className="ml-2 text-xs">({selectedFilters['OCCASION'].length})</span>
              )}
            </button>
            {desktopFilterOpen === 'OCCASION' && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDesktopFilterOpen(null)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="max-h-[60vh] overflow-y-auto">
                    {categoryData && categoryData.length > 2 && categoryData[2] ? (
                      <CategoryFilter 
                        categories={[categoryData[2]]}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                        defaultExpanded={true}
                        className="p-4"
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-4">Loading occasions...</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Price Filter Button */}
          <div className="relative flex-1">
            <button
              onClick={() => setDesktopFilterOpen(desktopFilterOpen === 'PRICE' ? null : 'PRICE')}
              className={`w-full px-4 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center cursor-pointer transition-colors ${
                selectedFilters['PRICE'] && selectedFilters['PRICE'].length > 0
                  ? 'bg-gray-100'
                  : ''
              }`}
            >
              Price
              {selectedFilters['PRICE'] && selectedFilters['PRICE'].length > 0 && (
                <span className="ml-2 text-xs">({selectedFilters['PRICE'].length})</span>
              )}
            </button>
            {desktopFilterOpen === 'PRICE' && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDesktopFilterOpen(null)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="max-h-[60vh] overflow-y-auto">
                    {categoryData && categoryData.length > 3 && categoryData[3] ? (
                      <CategoryFilter 
                        categories={[categoryData[3]]}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                        defaultExpanded={true}
                        className="p-4"
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-4">Loading prices...</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sort Button */}
          <div className="relative flex-1 w-full">
            <SortBy
              options={sortOptions}
              defaultValue={sortBy}
              onSortChange={onSortChange}
              label="Sort"
              className="w-full"
              variant="black"
            />
          </div>
        </div>
      </div>

      {/* Floating Filter and Sort Buttons - Mobile Only */}
      {/* {isMobile && showFloatingButtons && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:hidden">
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="relative inline-block w-full">
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="px-3 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center w-full cursor-pointer"
              >
                Filters
              </button>
              {mobileFiltersOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-[60] bg-black/50" 
                    onClick={() => setMobileFiltersOpen(false)}
                  />
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 shadow-lg z-[70] p-4 max-h-[60vh] overflow-y-auto">
                    {categoryData && categoryData.length > 0 ? (
                      <CategoryFilter 
                        categories={categoryData}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-2">Loading filters...</div>
                    )}
                  </div>
                </>
              )}
            </div>
            <SortBy
              options={sortOptions}
              defaultValue={sortBy}
              onSortChange={onSortChange}
              label="Sort"
              variant="black"
            />
          </div>
        </div>
      )} */}
    </>
  );
}

