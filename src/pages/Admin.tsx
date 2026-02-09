import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useModal } from '../hooks/useModal';
import { Special, GalleryImage, User } from '../types';
import { STORAGE_KEYS, CATEGORIES } from '../utils/constants';
import { formatDate } from '../utils/dateUtils';
import styles from './Admin.module.scss';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { logout, username } = useAuth();
  const [activeTab, setActiveTab] = useState<'specials' | 'gallery' | 'users'>('specials');

  // Storage
  const [specials, setSpecials] = useLocalStorage<Special[]>(STORAGE_KEYS.SPECIALS, []);
  const [galleryImages, setGalleryImages] = useLocalStorage<GalleryImage[]>(STORAGE_KEYS.GALLERY_IMAGES, []);
  const [users, setUsers] = useLocalStorage<User[]>(STORAGE_KEYS.USERS, []);

  // Modals
  const addSpecialModal = useModal();
  const cancelSpecialModal = useModal();
  const uploadImageModal = useModal();
  const addUserModal = useModal();

  // Forms
  const [specialForm, setSpecialForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    image: null as File | null
  });

  const [imageForm, setImageForm] = useState({
    category: 'cakes',
    title: '',
    description: '',
    image: null as File | null
  });

  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    securityQuestion: '',
    securityAnswer: ''
  });

  const [selectedSpecialId, setSelectedSpecialId] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle special form
  const handleSpecialImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSpecialForm({ ...specialForm, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialForm.image) {
      alert('Please select an image');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newSpecial: Special = {
        id: Date.now().toString(),
        title: specialForm.title,
        description: specialForm.description,
        startDate: specialForm.startDate,
        endDate: specialForm.endDate,
        imageUrl: reader.result as string,
        fileName: specialForm.image!.name,
        createdDate: new Date().toISOString()
      };

      setSpecials([newSpecial, ...specials]);
      setSpecialForm({ title: '', description: '', startDate: '', endDate: '', image: null });
      setImagePreview(null);
      addSpecialModal.close();
      alert('Special added successfully!');
    };
    reader.readAsDataURL(specialForm.image);
  };

  const handleCancelSpecial = () => {
    if (!selectedSpecialId) return;

    const confirmed = window.confirm('Are you sure you want to cancel this special?');
    if (confirmed) {
      setSpecials(specials.filter(s => s.id !== selectedSpecialId));
      setSelectedSpecialId('');
      cancelSpecialModal.close();
      alert('Special cancelled successfully!');
    }
  };

  // Handle gallery upload
  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageForm({ ...imageForm, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageForm.image) {
      alert('Please select an image');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        category: imageForm.category,
        title: imageForm.title,
        description: imageForm.description,
        imageUrl: reader.result as string,
        fileName: imageForm.image!.name,
        uploadDate: new Date().toISOString()
      };

      setGalleryImages([newImage, ...galleryImages]);
      setImageForm({ category: 'cakes', title: '', description: '', image: null });
      setImagePreview(null);
      uploadImageModal.close();
      alert('Image uploaded successfully!');
    };
    reader.readAsDataURL(imageForm.image);
  };

  const handleDeleteImage = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this image?');
    if (confirmed) {
      setGalleryImages(galleryImages.filter(img => img.id !== id));
      alert('Image deleted successfully!');
    }
  };

  // Handle user management
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if username already exists
    if (users.some(u => u.username === userForm.username)) {
      alert('Username already exists!');
      return;
    }

    const newUser: User = {
      username: userForm.username,
      email: userForm.email,
      password: userForm.password,
      role: 'admin',
      securityQuestion: userForm.securityQuestion,
      securityAnswer: userForm.securityAnswer.toLowerCase().trim(),
      createdDate: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    setUserForm({ username: '', email: '', password: '', securityQuestion: '', securityAnswer: '' });
    addUserModal.close();
    alert('User created successfully!');
  };

  const handleDeleteUser = (username: string) => {
    if (users.length === 1) {
      alert('Cannot delete the last user!');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete user "${username}"?`);
    if (confirmed) {
      setUsers(users.filter(u => u.username !== username));
      alert('User deleted successfully!');
    }
  };

  return (
    <div className={styles.adminPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <h1>Admin Dashboard</h1>
            <div className={styles.headerActions}>
              <span className={styles.username}>👤 {username}</span>
              <a href="/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <Button variant="outline">
                  View Site
                </Button>
              </a>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <div className="container">
          <button
            className={`${styles.tab} ${activeTab === 'specials' ? styles.active : ''}`}
            onClick={() => setActiveTab('specials')}
          >
            📢 Specials
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'gallery' ? styles.active : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            🖼️ Gallery
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
        </div>
      </div>

      {/* Content */}
      <main className={styles.content}>
        <div className="container">
          {/* Specials Tab */}
          {activeTab === 'specials' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Manage Specials</h2>
                <div className={styles.actions}>
                  <Button onClick={addSpecialModal.open}>+ Add Special</Button>
                  <Button variant="danger" onClick={cancelSpecialModal.open}>
                    Cancel Special
                  </Button>
                </div>
              </div>

              <div className={styles.grid}>
                {specials.length > 0 ? (
                  specials.map(special => (
                    <div key={special.id} className={styles.card}>
                      <img src={special.imageUrl} alt={special.title} className={styles.cardImage} />
                      <div className={styles.cardContent}>
                        <h3>{special.title}</h3>
                        <p>{special.description}</p>
                        <div className={styles.cardMeta}>
                          📅 {formatDate(special.startDate)} - {formatDate(special.endDate)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.empty}>
                    <span className={styles.emptyIcon}>📢</span>
                    <p>No specials yet. Click "Add Special" to create one!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Manage Gallery</h2>
                <Button onClick={uploadImageModal.open}>+ Upload Image</Button>
              </div>

              <div className={styles.grid}>
                {galleryImages.length > 0 ? (
                  galleryImages.map(img => (
                    <div key={img.id} className={styles.card}>
                      <img src={img.imageUrl} alt={img.title} className={styles.cardImage} />
                      <div className={styles.cardContent}>
                        <h3>{img.title}</h3>
                        <p className={styles.category}>
                          {CATEGORIES.find(c => c.id === img.category)?.name}
                        </p>
                        <Button
                          variant="danger"
                          size="small"
                          fullWidth
                          onClick={() => handleDeleteImage(img.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.empty}>
                    <span className={styles.emptyIcon}>🖼️</span>
                    <p>No images yet. Click "Upload Image" to add one!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Manage Users</h2>
                <Button onClick={addUserModal.open}>+ Add User</Button>
              </div>

              <div className={styles.usersList}>
                {users.map(user => (
                  <div key={user.username} className={styles.userCard}>
                    <div className={styles.userInfo}>
                      <h3>👤 {user.username}</h3>
                      {user.email && <p>📧 {user.email}</p>}
                      <p className={styles.userMeta}>
                        Created: {formatDate(user.createdDate)}
                      </p>
                    </div>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDeleteUser(user.username)}
                      disabled={users.length === 1}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Special Modal */}
      <Modal
        isOpen={addSpecialModal.isOpen}
        onClose={addSpecialModal.close}
        title="Add New Special"
        maxWidth="700px"
      >
        <form onSubmit={handleAddSpecial} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Title *</label>
            <input
              type="text"
              value={specialForm.title}
              onChange={e => setSpecialForm({ ...specialForm, title: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={specialForm.description}
              onChange={e => setSpecialForm({ ...specialForm, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Start Date *</label>
              <input
                type="date"
                value={specialForm.startDate}
                onChange={e => setSpecialForm({ ...specialForm, startDate: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>End Date *</label>
              <input
                type="date"
                value={specialForm.endDate}
                onChange={e => setSpecialForm({ ...specialForm, endDate: e.target.value })}
                min={specialForm.startDate}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSpecialImageChange}
              required
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className={styles.preview} />
            )}
          </div>

          <Button type="submit" fullWidth>Add Special</Button>
        </form>
      </Modal>

      {/* Cancel Special Modal */}
      <Modal
        isOpen={cancelSpecialModal.isOpen}
        onClose={cancelSpecialModal.close}
        title="Cancel Special"
      >
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>Select Special to Cancel</label>
            <select
              value={selectedSpecialId}
              onChange={e => setSelectedSpecialId(e.target.value)}
            >
              <option value="">-- Select a special --</option>
              {specials.map(special => (
                <option key={special.id} value={special.id}>
                  {special.title} ({formatDate(special.startDate)} - {formatDate(special.endDate)})
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="danger"
            fullWidth
            onClick={handleCancelSpecial}
            disabled={!selectedSpecialId}
          >
            Cancel Selected Special
          </Button>
        </div>
      </Modal>

      {/* Upload Image Modal */}
      <Modal
        isOpen={uploadImageModal.isOpen}
        onClose={uploadImageModal.close}
        title="Upload Image"
        maxWidth="700px"
      >
        <form onSubmit={handleUploadImage} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Category *</label>
            <select
              value={imageForm.category}
              onChange={e => setImageForm({ ...imageForm, category: e.target.value })}
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Title *</label>
            <input
              type="text"
              value={imageForm.title}
              onChange={e => setImageForm({ ...imageForm, title: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={imageForm.description}
              onChange={e => setImageForm({ ...imageForm, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleGalleryImageChange}
              required
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className={styles.preview} />
            )}
          </div>

          <Button type="submit" fullWidth>Upload Image</Button>
        </form>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={addUserModal.isOpen}
        onClose={addUserModal.close}
        title="Add New User"
        maxWidth="700px"
      >
        <form onSubmit={handleAddUser} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Username *</label>
            <input
              type="text"
              value={userForm.username}
              onChange={e => setUserForm({ ...userForm, username: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email (optional)</label>
            <input
              type="email"
              value={userForm.email}
              onChange={e => setUserForm({ ...userForm, email: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password *</label>
            <input
              type="password"
              value={userForm.password}
              onChange={e => setUserForm({ ...userForm, password: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Security Question *</label>
            <input
              type="text"
              value={userForm.securityQuestion}
              onChange={e => setUserForm({ ...userForm, securityQuestion: e.target.value })}
              placeholder="e.g., What is your favorite color?"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Security Answer *</label>
            <input
              type="text"
              value={userForm.securityAnswer}
              onChange={e => setUserForm({ ...userForm, securityAnswer: e.target.value })}
              placeholder="Answer to your security question"
              required
            />
          </div>

          <Button type="submit" fullWidth>Create User</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;
