import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function AISearchBar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isExpanded = isHovered || isFixed;

  const handleSearchClick = () => {
    setIsFixed(true);
  };

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <motion.div
          className="w-full py-4 md:py-6"
          onMouseEnter={() => !isFixed && setIsHovered(true)}
          onMouseLeave={() => !isFixed && setIsHovered(false)}
          animate={{
            paddingTop: isExpanded ? '2rem' : '1rem',
            paddingBottom: isExpanded ? '2rem' : '1rem',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <motion.div 
                  className="text-center mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-2xl md:text-3xl mb-2 tracking-tight">Discover Your Style</h2>
                  <p className="text-gray-600">Search our collection with AI-powered intelligence</p>
                </motion.div>

                <div className="relative flex items-center gap-3 px-5 md:px-6 py-3 md:py-4 bg-gray-50 rounded-full border border-gray-200 hover:border-gray-300 transition-colors">
                  <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search with AI..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
                  />
                  <button
                    onClick={handleSearchClick}
                    className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex-shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">AI</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className="relative flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-full border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="flex-1 text-gray-400">Search with AI...</span>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-xs">AI</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
