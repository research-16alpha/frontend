import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

interface FooterProps {
  show?: boolean;
}

export function Footer({ show = true }: FooterProps) {
  if (!show) return null;

  return (
    <footer className="bg-[#d8cfe6] border-t border-gray-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-700">
          
          {/* Left: Copyright */}
          <div className="text-center md:text-left text-xs text-gray-600">
           
           halfsy.shop © {new Date().getFullYear()} All rights reserved.
          </div>

          {/* Center: Legal */}
          <div className="flex gap-6 text-xs">
            <button className="hover:text-black transition-colors">
              Privacy Policy
            </button>
            <button className="hover:text-black transition-colors">
              Terms of Service
            </button>
          </div>

          {/* Right: Social Icons */}
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-black transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
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
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
