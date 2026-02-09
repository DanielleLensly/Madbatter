import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/home/Hero';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useModal } from '../hooks/useModal';
import { useImageLoader } from '../hooks/useImageLoader';
import { sendBookingEmail, sendContactEmail } from '../utils/emailService';
import { Special, GalleryImage, CategoryType } from '../types';
import { formatDate, isDateInRange, isDateBefore, isDateAfter } from '../utils/dateUtils';
import { formatPhoneNumber, unformatPhoneNumber } from '../utils/phoneUtils';
import { STORAGE_KEYS, CATEGORIES } from '../utils/constants';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  // Auto-load images from manifest on first app load
  useImageLoader();

  const [specials] = useLocalStorage<Special[]>(STORAGE_KEYS.SPECIALS, []);
  const [galleryImages] = useLocalStorage<GalleryImage[]>(STORAGE_KEYS.GALLERY_IMAGES, []);

  const [activeSpecialsTab, setActiveSpecialsTab] = useState<'current' | 'upcoming' | 'past'>('current');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const bookingModal = useModal();
  const serviceModal = useModal();
  const thankYouModal = useModal();

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    description: ''
  });

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  // Filter specials by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentSpecials = specials.filter(s => isDateInRange(today, s.startDate, s.endDate));
  const upcomingSpecials = specials.filter(s => isDateBefore(today, s.startDate));
  const pastSpecials = specials.filter(s => isDateAfter(today, s.endDate));

  // Get images for selected category
  const categoryImages = selectedCategory
    ? galleryImages.filter(img => img.category === selectedCategory)
    : [];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingSubmitting(true);

    try {
      // 1. Send Email
      await sendBookingEmail({
        ...bookingForm,
        phone: unformatPhoneNumber(bookingForm.phone)
      });

      // 2. Save local backup (optional, keeping existing logic)
      const bookingRequests = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKING_REQUESTS) || '[]');
      bookingRequests.push({
        ...bookingForm,
        phone: unformatPhoneNumber(bookingForm.phone),
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.BOOKING_REQUESTS, JSON.stringify(bookingRequests));

      // 3. UI Updates
      bookingModal.close();
      thankYouModal.open();
      setBookingForm({ name: '', phone: '', email: '', date: '', description: '' });
    } catch (error) {
      alert('Failed to send booking request. Please try again or contact us directly.');
      console.error(error);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSubmitting(true);

    try {
      await sendContactEmail({
        ...contactForm,
        phone: unformatPhoneNumber(contactForm.phone)
      });
      alert('Message sent successfully!');
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      alert('Failed to send message. Please try again later.');
      console.error(error);
    } finally {
      setIsContactSubmitting(false);
    }
  };

  const openServiceModal = (category: CategoryType) => {
    setSelectedCategory(category);
    serviceModal.open();
  };

  return (
    <div className={styles.home}>
      <Navbar />

      <Hero onBookingClick={bookingModal.open} />

      {/* Specials Section */}
      <section id="specials" className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Special Offers</h2>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeSpecialsTab === 'current' ? styles.active : ''}`}
              onClick={() => setActiveSpecialsTab('current')}
            >
              Current
            </button>
            <button
              className={`${styles.tab} ${activeSpecialsTab === 'upcoming' ? styles.active : ''}`}
              onClick={() => setActiveSpecialsTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`${styles.tab} ${activeSpecialsTab === 'past' ? styles.active : ''}`}
              onClick={() => setActiveSpecialsTab('past')}
            >
              Past
            </button>
          </div>

          <div className={styles.specialsGrid}>
            {activeSpecialsTab === 'current' && (
              currentSpecials.length > 0 ? (
                currentSpecials.map(special => (
                  <div key={special.id} className={styles.specialCard}>
                    <span className={styles.specialBadge}>Special Offer</span>
                    <img src={special.imageUrl} alt={special.title} className={styles.specialImage} />
                    <div className={styles.specialContent}>
                      <h3>{special.title}</h3>
                      {special.description && <p>{special.description}</p>}
                      <div className={styles.specialDates}>
                        📅 {formatDate(special.startDate)} - {formatDate(special.endDate)}
                      </div>
                      <Button onClick={bookingModal.open}>Order Now →</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🎉</span>
                  <h3>No Active Specials</h3>
                  <p>Check back soon for amazing deals!</p>
                </div>
              )
            )}

            {activeSpecialsTab === 'upcoming' && (
              upcomingSpecials.length > 0 ? (
                upcomingSpecials.map(special => (
                  <div key={special.id} className={styles.specialCard}>
                    <span className={`${styles.specialBadge} ${styles.upcoming}`}>Coming Soon</span>
                    <img src={special.imageUrl} alt={special.title} className={styles.specialImage} />
                    <div className={styles.specialContent}>
                      <h3>{special.title}</h3>
                      {special.description && <p>{special.description}</p>}
                      <div className={styles.specialDates}>
                        ⏰ Starts {formatDate(special.startDate)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>⏰</span>
                  <h3>No Upcoming Specials</h3>
                  <p>Stay tuned for exciting new offers!</p>
                </div>
              )
            )}

            {activeSpecialsTab === 'past' && (
              pastSpecials.length > 0 ? (
                pastSpecials.map(special => (
                  <div key={special.id} className={`${styles.specialCard} ${styles.past}`}>
                    <span className={`${styles.specialBadge} ${styles.expired}`}>Expired</span>
                    <img src={special.imageUrl} alt={special.title} className={styles.specialImage} />
                    <div className={styles.specialContent}>
                      <h3>{special.title}</h3>
                      {special.description && <p>{special.description}</p>}
                      <div className={styles.specialDates}>
                        📅 Ran from {formatDate(special.startDate)} to {formatDate(special.endDate)}
                      </div>
                      <div className={styles.expiredNotice}>This offer has ended</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>📜</span>
                  <h3>No Past Specials</h3>
                  <p>Previous special offers will appear here.</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Our Services</h2>
          <div className={styles.servicesGrid}>
            {CATEGORIES.map(category => (
              <div
                key={category.id}
                className={styles.serviceCard}
                onClick={() => openServiceModal(category.id as CategoryType)}
              >
                <span className={styles.serviceIcon}>{category.icon}</span>
                <h3>{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Get in Touch</h2>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>+27 123 456 789</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <div>
                  <h4>Email</h4>
                  <p>hello@themadbatter.com</p>
                </div>
              </div>
            </div>

            <form className={styles.contactForm} onSubmit={handleContactSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number (e.g., 082 123 4567)"
                value={contactForm.phone}
                onChange={e => setContactForm({ ...contactForm, phone: formatPhoneNumber(e.target.value) })}
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                required
              />
              <Button type="submit" fullWidth disabled={isContactSubmitting}>
                {isContactSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Modal isOpen={bookingModal.isOpen} onClose={bookingModal.close} title="Book a Consultation" maxWidth="800px">
        <form onSubmit={handleBookingSubmit} className={styles.bookingForm}>
          <input
            type="text"
            placeholder="Your Name"
            value={bookingForm.name}
            onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number (e.g., 082 123 4567)"
            value={bookingForm.phone}
            onChange={e => setBookingForm({ ...bookingForm, phone: formatPhoneNumber(e.target.value) })}
            required
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={bookingForm.email}
            onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })}
          />
          <input
            type="date"
            value={bookingForm.date}
            onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          <textarea
            placeholder="Tell us about your event..."
            rows={4}
            value={bookingForm.description}
            onChange={e => setBookingForm({ ...bookingForm, description: e.target.value })}
            required
          />
          <Button type="submit" fullWidth disabled={isBookingSubmitting}>
            {isBookingSubmitting ? 'Sending...' : 'Submit Request'}
          </Button>
        </form>
      </Modal>

      {/* Service Modal */}
      <Modal
        isOpen={serviceModal.isOpen}
        onClose={serviceModal.close}
        title={selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : ''}
        maxWidth="900px"
      >
        <div className={styles.galleryGrid}>
          {categoryImages.length > 0 ? (
            categoryImages.map(img => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt={img.title}
                className={styles.galleryImage}
                onClick={() => setSelectedImage(img.imageUrl)}
              />
            ))
          ) : (
            <p>No images available for this category yet.</p>
          )}
        </div>
      </Modal>

      {/* Lightbox */}
      {selectedImage && (
        <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full size" />
        </div>
      )}

      {/* Thank You Modal */}
      <Modal isOpen={thankYouModal.isOpen} onClose={thankYouModal.close} title="Thank You!">
        <div className={styles.thankYou}>
          <span className={styles.thankYouIcon}>✅</span>
          <h3>Booking Request Received!</h3>
          <p>We'll get back to you shortly to confirm your consultation.</p>
          <Button onClick={thankYouModal.close}>Close</Button>
        </div>
      </Modal>

      {/* Floating Booking Button */}
      <button className={styles.floatingBtn} onClick={bookingModal.open} aria-label="Book Now">
        📅
      </button>
    </div>
  );
};

export default Home;
