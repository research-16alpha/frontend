import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

interface FooterProps {
  show?: boolean;
}

export function Footer({ show = true }: FooterProps) {
  if (!show) return null;

  return (
    <footer className="bg-[#d8cfe6] border-t border-gray-300 mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 md:py-6">
        {/* Mobile: Two rows, Desktop: Single row with 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-center text-xxs md:text-xs text-gray-700">
          
          {/* Mobile: Hidden, Desktop: Left - Copyright */}
          <div className="hidden md:block text-left text-gray-600 select-none whitespace-nowrap">
            halfsy.shop © {new Date().getFullYear()} All rights reserved.
          </div>

          {/* Mobile: Top row, Desktop: Center - Legal links */}
          <div className="flex gap-3 md:gap-6 justify-center">
            <button className="hover:text-black transition-colors cursor-pointer whitespace-nowrap">
              Privacy Policy
            </button>
            <button className="hover:text-black transition-colors cursor-pointer whitespace-nowrap">
              Terms of Service
            </button>
          </div>

          {/* Mobile: Hidden, Desktop: Right - Social Icons */}
          <div className="hidden md:flex md:flex-row md:items-center md:justify-end md:gap-2">
            <span className="text-gray-600 whitespace-nowrap">Follow us on:</span>
            <a
              href="https://www.instagram.com/halfsy.shop?igsh=YmZraDgwM2wzdDQx"
              aria-label="Instagram"
              className="hover:text-black transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            {/* <a
              href="#"
              aria-label="Twitter"
              className="hover:text-black transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-black transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a> */}
          </div>

          {/* Mobile: Bottom row - Copyright and Social together */}
          <div className="flex flex-row items-center justify-center gap-2 md:hidden col-span-1">
            <div className="text-center text-gray-600 select-none whitespace-nowrap">
              halfsy.shop © {new Date().getFullYear()} All rights reserved.
            </div>
            <div className="flex flex-row items-center gap-1.5">
              <span className="text-gray-600 whitespace-nowrap">Follow us on:</span>
              <a
                href="https://www.instagram.com/halfsy.shop?igsh=YmZraDgwM2wzdDQx"
                aria-label="Instagram"
                className="hover:text-black transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              {/* <a
                href="#"
                aria-label="Twitter"
                className="hover:text-black transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-black transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a> */}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
