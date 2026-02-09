import React from 'react';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.copyright}>
          &copy; {currentYear} The Mad Batter. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
