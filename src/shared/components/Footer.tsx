import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

interface FooterProps {
  show?: boolean;
}

export function Footer({ show = true }: FooterProps) {
  if (!show) return null;

  return (
    <footer className="bg-[#173f56] border-t border-gray-300 mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3 sm:py-4 md:py-5 lg:py-6 xl:py-8">
        {/* Mobile: Two rows, Desktop: Single row with 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 sm:gap-2 md:gap-3 lg:gap-6 xl:gap-8 items-center text-xxs sm:text-xs md:text-base lg:text-lg xl:text-xl footer-text">
  
          {/* Mobile: Hidden, Desktop: Left - Copyright */}
          <div className="hidden md:block text-left footer-text select-none whitespace-nowrap">
            halfsy.shop © {new Date().getFullYear()} All rights reserved.
          </div>

          {/* Mobile: Top row, Desktop: Center - Legal links */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 justify-center">
            <button className="footer-text footer-text-hover transition-colors cursor-pointer whitespace-nowrap">
              Privacy Policy
            </button>
            <button className="footer-text footer-text-hover transition-colors cursor-pointer whitespace-nowrap">
              Terms of Service
            </button>
          </div>

          {/* Mobile: Hidden, Desktop: Right - Social Icons */}
          <div className="hidden md:flex md:flex-row md:items-center md:justify-end gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-4">
            <span className="footer-text whitespace-nowrap">Follow us on:</span>
            <a
              href="https://www.instagram.com/halfsy.shop?igsh=YmZraDgwM2wzdDQx"
              aria-label="Instagram"
              className="footer-text footer-text-hover transition-colors"
            >
              <Instagram className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
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
          <div className="flex flex-row items-center justify-center gap-1 sm:gap-2 md:hidden col-span-1">
            <div className="text-center footer-text select-none whitespace-nowrap">
              halfsy.shop © {new Date().getFullYear()} All rights reserved.
            </div>
            <div className="flex flex-row items-center gap-1 sm:gap-1.5 md:gap-2">
              <span className="footer-text whitespace-nowrap">Follow us on:</span>
              <a
                href="https://www.instagram.com/halfsy.shop?igsh=YmZraDgwM2wzdDQx"
                aria-label="Instagram"
                className="footer-text footer-text-hover transition-colors"
              >
                <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>

            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
