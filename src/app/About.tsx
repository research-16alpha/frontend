import * as React from 'react';
import { AnnouncementBanner } from '../shared/components/AnnouncementBanner';
import { Navbar } from '../shared/components/Navbar';
import { AISearchBar } from '../shared/components/AISearchBar';
import { Footer } from '../shared/components/Footer';
import { useNavigation } from '../shared/contexts/NavigationContext';
import { Mail, Send } from 'lucide-react';
import { ImageWithFallback } from '../shared/components/figma/ImageWithFallback';

export function About() {
  const { navigateToHome, navigateToProducts, navigateToAccount, navigateToAbout, navigateToCurated, navigateToNew } = useNavigation();

  const handleCategoryClick = (category: string) => {
    if (category === 'men' || category === 'women') {
      navigateToProducts(category);
    } else {
      navigateToProducts();
    }
  };

  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isEmailFocused, setIsEmailFocused] = React.useState(false);

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
  const pageTitle = 'About halfsy';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBanner />
      <Navbar 
        onFeaturedClick={() => {}} 
        onProductsClick={navigateToProducts}
        onLogoClick={navigateToHome}
        onAccountClick={navigateToAccount}
        onAboutClick={navigateToAbout}
        onCuratedClick={navigateToCurated}
        onNewArrivalsClick={navigateToNew}
        onCategoryClick={handleCategoryClick}
        onPreOwnedClick={() => {
          navigateToProducts();
        }}
      />
      <AISearchBar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="text-xs text-gray-600">
          <button onClick={navigateToHome} className="hover:underline">Home</button>
          <span className="mx-2">/</span>
          <span>{pageTitle}</span>
            </div>
          </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="mb-2 text-2xl md:text-3xl">{pageTitle}</h2>
          <p className="text-sm text-gray-600">
            Discover our curated collection of premium fashion and accessories. Learn more about halfsy and our mission to bring you the finest selection of luxury products.
          </p>
        </div>

        {/* About Us Grid */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutUs.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                  <ImageWithFallback
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 uppercase tracking-wide">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.subtext}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        
        <div className="max-w-xl mx-auto my-20 px-4">
  <h3 className="text-2xl md:text-3xl font-medium mb-4 text-center tracking-tight">
    Get in Touch
  </h3>

  <p className="text-gray-500 text-sm text-center mb-10 max-w-md mx-auto">
    Have a question or feedback? We’d love to hear from you.
  </p>

  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] px-8 py-8">
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
        >
          Email
        </label>
        <div className="relative">
          {!isEmailFocused && (
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          )}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            required
            className={`
              w-full px-4 py-3
              rounded-xl
              bg-gray-50
              text-sm
              focus:outline-none
              focus:ring-2 focus:ring-black/10
              transition
              ${isEmailFocused ? 'pl-4' : 'pl-11'}
            `}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="Tell us what’s on your mind"
          className="
            w-full px-4 py-3
            rounded-xl
            bg-gray-50
            text-sm
            placeholder:text-gray-400
            focus:outline-none
            focus:ring-2 focus:ring-black/10
            resize-none
            transition
          "
        />
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full
            py-3
            rounded-xl
            bg-black
            text-white
            text-sm
            uppercase
            tracking-wider
            hover:bg-gray-900
            transition
            disabled:opacity-50
            flex items-center justify-center gap-2
          "
        >
          {isSubmitting ? (
            'Sending...'
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
      </div>

    </form>
  </div>
</div>

      </main>

      <Footer />
    </div>
  );
}

interface AboutUsItem {
  name: string;
  images: string[];
  subtext: string;
  link: string;
}

const aboutUs: AboutUsItem[] = [
  {
    name: "Inception",
    images: [
      "https://images.unsplash.com/photo-1700150662401-9b96a5fedfbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
    ],
    subtext: "The story of how halfsy began—a vision to curate the world's finest luxury fashion and make it accessible to discerning individuals.",
    link: "#inception"
  },
  {
    name: "Journey",
    images: [
      "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1610209740880-6ecc4b20ea78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    ],
    subtext: "Our evolution from a small curated collection to a trusted destination for luxury fashion, building relationships with premier brands worldwide.",
    link: "#journey"
  },
  {
    name: "Vision",
    images: [
      "https://images.unsplash.com/photo-1610209740880-6ecc4b20ea78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    ],
    subtext: "Looking forward—our commitment to innovation, sustainability, and bringing you the most exceptional fashion experiences for years to come.",
    link: "#vision"
  }
];
