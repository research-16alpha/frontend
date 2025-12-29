import React, { useEffect, useState } from 'react';

export function AnnouncementBanner() {
  const textContent =
    " The Halfsy Ship is sailing soon • A refined journey through modern luxury • Navigating the world's finest brands with care and intention • Buy better, Sail smarter • Join our waitlist to get top brand deals •";
  const textContentMobile = "The Halfsy Ship is sailing soon • A refined journey through Modern Luxury • Navigating the world's finest brands with care and intention • Sourced from Sales across the Web • Buy Better, Sail Smarter • Join our Waitlist now • Get Top Brand Deals First •";
  // Break text into sentences for mobile animation
  const sentences = textContentMobile
    .split('•')
    .map(s => s.trim())
    .filter(Boolean);

  // Track viewport width to determine if desktop
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const isDesktop = windowWidth >= 1024;

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    // Set initial width
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Mobile animation loop - only run on mobile/tablet
  useEffect(() => {
    if (isDesktop) return; // Don't run animation on desktop

    const interval = setInterval(() => {
      setVisible(false); // exit

      setTimeout(() => {
        setIndex(prev => (prev + 1) % sentences.length);
        setVisible(true); // enter
      }, 700);
    }, 3000);

    return () => clearInterval(interval);
  }, [sentences.length, isDesktop]);


  return (
    <div className="relative w-full bg-black text-white overflow-hidden">
      {isDesktop ? (
        /* ===== DESKTOP / LARGE VIEWPORTS: MARQUEE ===== */
        <div className="flex relative overflow-x-hidden" style={{ willChange: 'transform' }}>
          <div 
            className="animate-marquee py-2 whitespace-nowrap"
            style={{ 
              whiteSpace: 'nowrap',
              wordBreak: 'keep-all',
              overflowWrap: 'normal',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <span className="mx-4 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base 2xl:text-lg font-body">
              {textContent}
            </span>
          </div>
          <div 
            className="absolute top-0 animate-marquee2 py-2 whitespace-nowrap"
            style={{ 
              whiteSpace: 'nowrap',
              wordBreak: 'keep-all',
              overflowWrap: 'normal',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <span className="mx-4 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base 2xl:text-lg font-body">
              {textContent}
            </span>
          </div>
        </div>
      ) : (
        /* ===== MOBILE + TABLET: SENTENCE TRANSITION ===== */
        <div className="relative h-8 py-4 flex items-center justify-center overflow-hidden">
          <div
            key={index}
            className={`
              absolute whitespace-nowrap
              text-sm md:text-sm
              transition-all duration-700 ease-in-out
              font-body
              ${visible ? 'left-1/2 -translate-x-1/2 opacity-100' : 'left-full translate-x-0 opacity-0'}
            `}
            style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', overflowWrap: 'normal' }}
          >
            {sentences[index]}
          </div>
        </div>
      )}
    </div>
  );
}
