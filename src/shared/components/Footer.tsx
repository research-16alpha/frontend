import React from 'react';
import { Instagram } from 'lucide-react';

interface FooterProps {
  show?: boolean;
}

export function Footer({ show = true }: FooterProps) {
  if (!show) return null;

  return (
    <footer className="bg-[#173f56] border-t border-gray-300 mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 md:py-6">
        
        {/* 
          Mobile/Tablet: 2 rows
          Desktop: 1 row (3 columns)
        */}
        <div className="
          grid
          grid-cols-1
          gap-y-3
          md:grid-cols-3
          md:gap-y-0
          items-center
          text-xs sm:text-sm md:text-base lg:text-lg footer-text
        ">

          {/* Copyright */}
          <div className="
            text-center
            md:text-left
            md:order-1
          ">
            halfsy.shop © {new Date().getFullYear()} All rights reserved.
          </div>

          {/* Legal links */}
          <div className="
            flex
            justify-center
            gap-4
            md:order-2
          ">
            <button className="footer-text footer-text-hover transition-colors whitespace-nowrap">
              Privacy Policy
            </button>
            <button className="footer-text footer-text-hover transition-colors whitespace-nowrap">
              Terms of Service
            </button>
          </div>

          {/* Social */}
          <div className="
            flex
            justify-center
            md:justify-end
            items-center
            gap-2
            md:order-3
          ">
            <span className="footer-text whitespace-nowrap">Follow us on:</span>
            <a
              href="https://www.instagram.com/halfsy.shop?igsh=YmZraDgwM2wzdDQx"
              aria-label="Instagram"
              className="footer-text footer-text-hover transition-colors"
            >
              <Instagram className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
