'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;
      
      // Calculate scroll progress (0-100)
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
      
      // Show button when user scrolls down 300px
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check if user is near bottom of page
      if (scrollTop + windowHeight >= documentHeight - 100) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Home to go to top
      if ((event.ctrlKey || event.metaKey) && event.key === 'Home') {
        event.preventDefault();
        scrollToTop();
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop version - bottom right */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <div className="group relative">
          {/* Progress Ring */}
          <div className="absolute inset-0">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200 opacity-30"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`}
                className="text-primary-600 transition-all duration-300"
                style={{ strokeLinecap: 'round' }}
              />
            </svg>
          </div>

          {/* Button */}
          <button
            onClick={scrollToTop}
            className={`relative inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              isAtBottom 
                ? 'bg-primary-700 text-white hover:bg-primary-800' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
            aria-label="Go to top (Ctrl+Home)"
            title="Go to top (Ctrl+Home)"
          >
            <ChevronUp size={20} />
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            Go to top
            <div className="text-xs text-gray-400 mt-1">Ctrl+Home</div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Mobile version - bottom center */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={scrollToTop}
          className={`inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            isAtBottom 
              ? 'bg-primary-700 text-white hover:bg-primary-800' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
          aria-label="Go to top"
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </>
  );
} 