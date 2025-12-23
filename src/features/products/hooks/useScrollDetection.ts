import { useState, useEffect, RefObject } from 'react';

interface UseScrollDetectionOptions {
  elementRef: RefObject<HTMLElement>;
  enabled: boolean;
}

export function useScrollDetection({ elementRef, enabled }: UseScrollDetectionOptions) {
  const [isScrolledOut, setIsScrolledOut] = useState(false);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const handleScroll = () => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      setIsScrolledOut(rect.bottom < 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled, elementRef]);

  return isScrolledOut;
}

