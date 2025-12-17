import React, { useState } from 'react';
import { Navbar } from '../shared/components/Navbar';
import { Footer } from '../shared/components/Footer';
import { Mail, Send } from 'lucide-react';

interface AboutProps {
  onNavigateHome?: () => void;
  onNavigateProducts?: () => void;
  onNavigateAccount?: () => void;
  onNavigateAbout?: () => void;
  onNavigateCurated?: () => void;
  onCategoryClick?: (category: string) => void;
  onNewArrivalsClick?: () => void;
}

export function About({ 
  onNavigateHome, 
  onNavigateProducts, 
  onNavigateAccount, 
  onNavigateAbout,
  onNavigateCurated,
  onCategoryClick,
  onNewArrivalsClick
}: AboutProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        onFeaturedClick={() => {}} 
        onProductsClick={onNavigateProducts}
        onLogoClick={onNavigateHome}
        onAccountClick={onNavigateAccount}
        onAboutClick={onNavigateAbout}
        onNewArrivalsClick={onNewArrivalsClick}
        onCategoryClick={onCategoryClick}
        onPreOwnedClick={() => {
          // Navigate to products page - can be customized to filter for pre-owned items
          if (onNavigateProducts) {
            onNavigateProducts();
          }
        }}
        onCuratedClick={onNavigateCurated}
      />

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        {/* About Section */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">About Us</h1>
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 lg:p-16 space-y-8 transition-all duration-300 hover:shadow-xl">
            <div className="group">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] hover:border-l-4 hover:border-black cursor-default">
                Welcome to halfsy, your premier destination for curated fashion and lifestyle products. 
                We are dedicated to bringing you the finest selection of clothing, accessories, and 
                essentials that combine style, quality, and affordability.
              </p>
            </div>
            <div className="group">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] hover:border-l-4 hover:border-black cursor-default">
                At halfsy, we believe that everyone deserves access to high-quality products that reflect 
                their personal style. Our carefully curated collection features pieces from trusted brands 
                and emerging designers, ensuring you find exactly what you're looking for.
              </p>
            </div>
            <div className="group">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] hover:border-l-4 hover:border-black cursor-default">
                Our mission is to make shopping for fashion and lifestyle products a seamless and enjoyable 
                experience. We're committed to providing exceptional customer service, fast shipping, and 
                a hassle-free return policy so you can shop with confidence.
              </p>
            </div>
            <div className="group">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] hover:border-l-4 hover:border-black cursor-default">
                Thank you for choosing halfsy. We're excited to be part of your style journey!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-700 mb-6">
              Have a question or feedback? We'd love to hear from you! Fill out the form below and 
              we'll get back to you as soon as possible.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer show={true} />
    </div>
  );
}

