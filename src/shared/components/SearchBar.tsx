import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="bg-white border-b border-gray-100 h-[600px] md:h-[700px] flex items-center justify-center px-12">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4 tracking-tight">Discover Your Style</h1>
          <p className="text-lg text-gray-600">Search our collection with AI-powered intelligence</p>
        </div>
        
        <div 
          className={`relative flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-full transition-all ${
            isSearchFocused ? 'ring-2 ring-black' : ''
          }`}
        >
          <Search className="w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search with AI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-400"
          />
          <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}