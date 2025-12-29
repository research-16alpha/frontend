import React from 'react';
import { Instagram } from 'lucide-react';

interface FooterProps {
  show?: boolean;
}

export function Footer({ show = true }: FooterProps) {
  if (!show) return null;

  return (
    <footer>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 md:py-6">
        <div className="flex flex-row md:flex-row justify-between items-center gap-1 md:gap-0 text-xs sm:text-sm md:text-base lg:text-lg footer-text font-body">
          {/* Copyright */}
          <div>
            halfsy.shop © {new Date().getFullYear()}
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

          {/* Social */}
          <div className="flex items-center gap-2">
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


