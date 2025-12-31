import React from 'react';
import { Instagram } from 'lucide-react';

interface FooterProps {
  show?: boolean;
}

export function Footer({ show = true }: FooterProps) {
  if (!show) return null;

  return (
    <footer>
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2 sm:py-4 md:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-1 md:gap-1 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl footer-text font-body">
        {/* <div className="flex  md:flex-row justify-between items-center md:gap-0 text-xxs sm:text-sm md:text-base lg:text-lg xl:text-xl footer-text font-body"> */}
          
          {/* Social */}
          <div className="flex items-center gap-2">
            <span className="footer-text whitespace-nowrap">Follow us on</span>
            <a
              href="https://www.instagram.com/halfsy.shop?igsh=YmZraDgwM2wzdDQx"
              aria-label="Instagram"
              className="footer-text footer-text-hover transition-colors"
            >
              <Instagram className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" strokeWidth={1.5} />
            </a>
          </div>
          
          {/* <div className="footer-text footer-text-hover transition-colors whitespace-nowrap cursor-pointer">
          Privacy Policy
          </div>
          <div className="footer-text footer-text-hover transition-colors whitespace-nowrap cursor-pointer">
            Terms of Service
          </div> */}

          {/* Legal links */}
          <div className="flex gap-1">
            <div className="footer-text footer-text-grey transition-colors whitespace-nowrap cursor-pointer">
              Privacy Policy | Terms of Service
            </div>
          </div>

          {/* Copyright */}
          <div>
            halfsy.shop © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}


