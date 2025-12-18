import * as React from "react";

// Match Tailwind's md breakpoint: 48rem = 768px
// CSS uses @media (width >= 48rem), so mobile is < 768px
const MOBILE_BREAKPOINT = 48 * 16; // 768px - matches Tailwind md breakpoint exactly

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // Mobile is < 768px, desktop is >= 768px (matches CSS md: breakpoint)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
