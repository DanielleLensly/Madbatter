import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.copyright}>
            &copy; {currentYear} The Mad Batter. All rights reserved.
          </div>
          <div className={styles.links}>
            <Link to="/madbatter-login" className={styles.adminLink}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
