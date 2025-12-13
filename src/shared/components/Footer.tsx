import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

interface FooterProps {
  show?: boolean;
}

export function Footer({ show = true }: FooterProps) {
  const footerLinks = {
    Shop: ['New Arrivals', 'Men', 'Women', 'Accessories', 'Sale'],
    Company: ['About Us', 'Careers', 'Sustainability', 'Press'],
    Support: ['Contact', 'Shipping', 'Returns', 'FAQ', 'Size Guide'],
  };

  return (
    <footer className="bg-[#d8cfe6] text-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <div className="text-2xl mb-4 tracking-tight">halfsy</div>
            <p className="text-sm text-gray-700 mb-6">
              Curated minimalist essentials for the modern lifestyle.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Instagram className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm mb-4 uppercase tracking-wide">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button className="text-sm text-gray-700 hover:text-black transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>&copy; 2025 halfsy. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-black transition-colors">Privacy Policy</button>
              <button className="hover:text-black transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}