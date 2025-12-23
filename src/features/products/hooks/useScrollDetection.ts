import { useState, useEffect, RefObject } from 'react';

interface UseScrollDetectionOptions {
  elementRef: RefObject<HTMLElement>;
  enabled: boolean;
}

export function useScrollDetection({ elementRef, enabled }: UseScrollDetectionOptions) {
  const [isScrolledOut, setIsScrolledOut] = useState(false);

  useEffect(() => {
    if (!enabled || !elementRef.current) {
      setIsScrolledOut(false);
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      const element = elementRef.current;
      if (!element) {
        setIsScrolledOut(false);
        return;
      }

      const rect = element.getBoundingClientRect();
      // Show floating buttons when the element has scrolled out of view
      // rect.top < 0 means the top of the element has scrolled past the top of the viewport
      setIsScrolledOut(rect.top < 0);
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Check initial state
    handleScroll();

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
    };
  }, [enabled, elementRef]);

  return isScrolledOut;
}

