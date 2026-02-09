import React, { useState, useEffect } from 'react';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import styles from './Navbar.module.scss';

interface NavbarProps {
  sections?: string[];
}

const Navbar: React.FC<NavbarProps> = ({ sections = ['home', 'services', 'contact'] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useScrollSpy(sections, 150);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (mobileMenuOpen && !target.closest(`.${styles.navLinks}`) && !target.closest(`.${styles.mobileMenuBtn}`)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <div className={styles.navContent}>
          <div className={styles.logo} onClick={() => scrollToSection('home')}>
            The Mad Batter
          </div>

          <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.active : ''}`}>
            <a
              className={`${styles.navLink} ${activeSection === 'home' ? styles.active : ''}`}
              onClick={() => scrollToSection('home')}
            >
              Home
            </a>
            <a
              className={`${styles.navLink} ${activeSection === 'services' ? styles.active : ''}`}
              onClick={() => scrollToSection('services')}
            >
              Services
            </a>
            <a
              className={`${styles.navLink} ${activeSection === 'contact' ? styles.active : ''}`}
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </a>
          </div>

          <button
            className={`${styles.mobileMenuBtn} ${mobileMenuOpen ? styles.active : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
