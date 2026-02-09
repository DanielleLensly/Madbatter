import { useState, useEffect } from 'react';

export const useScrollSpy = (sectionIds: string[], offset: number = 150) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if user is at the bottom of the page
      const isAtBottom = scrollPosition + windowHeight >= documentHeight - 50;

      if (isAtBottom && sectionIds.length > 0) {
        // If at bottom, activate the last section (usually Contact)
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      // Normal scroll spy logic
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop - offset) {
            setActiveSection(id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
};
