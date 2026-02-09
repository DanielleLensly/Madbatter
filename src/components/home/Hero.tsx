import React from 'react';
import Button from '../common/Button';
import styles from './Hero.module.scss';

interface HeroProps {
  onBookingClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookingClick }) => {
  const scrollToServices = () => {
    const section = document.getElementById('services');
    if (section) {
      const offsetTop = section.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>The Mad Batter</h1>
        <p className={styles.heroSubtitle}>
          Artisan Baking Made with Love and Expertise
        </p>
        <div className={styles.heroCta}>
          <Button size="large" onClick={onBookingClick}>
            Book a Consultation
          </Button>
          <Button variant="outline" size="large" onClick={scrollToServices}>
            View Our Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
