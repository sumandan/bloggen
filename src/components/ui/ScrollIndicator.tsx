import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop;
      setIsVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'scroll-indicator',
        isVisible && 'visible'
      )}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-5 h-5 text-gray-600" />
    </button>
  );
}