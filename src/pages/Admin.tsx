import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ImageUpload from '../components/common/ImageUpload';
import { useModal } from '../hooks/useModal';
import { Special, GalleryImage, User } from '../types';
import { STORAGE_KEYS, CATEGORIES } from '../utils/constants';
import { formatDate } from '../utils/dateUtils';
import { defaultGalleryImages } from '../data/defaultGalleryData';
import styles from './Admin.module.scss';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { logout, username } = useAuth();
  const [activeTab, setActiveTab] = useState<'specials' | 'gallery' | 'users'>('specials');

  // Storage
  const [specials, setSpecials] = useLocalStorage<Special[]>(STORAGE_KEYS.SPECIALS, []);
  const [galleryImages, setGalleryImages] = useLocalStorage<GalleryImage[]>(STORAGE_KEYS.GALLERY_IMAGES, defaultGalleryImages);
  const [users, setUsers] = useLocalStorage<User[]>(STORAGE_KEYS.USERS, []);

  // Modals
  const addSpecialModal = useModal();
  const editSpecialModal = useModal();
  const uploadImageModal = useModal();
  const editImageModal = useModal();
  const addUserModal = useModal();
  const editUserModal = useModal();

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

  // Edit state
  const [editingSpecial, setEditingSpecial] = useState<Special | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/madbatter-login');
  };

  // ==================== SPECIALS ====================
  const handleSpecialImageSelect = (file: File) => {
    setSpecialForm({ ...specialForm, image: file });
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
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
      resetSpecialForm();
      addSpecialModal.close();
      alert('Special added successfully!');
    };
    reader.readAsDataURL(specialForm.image);
  };

  const openEditSpecial = (special: Special) => {
    setEditingSpecial(special);
    setSpecialForm({
      title: special.title,
      description: special.description || '',
      startDate: special.startDate,
      endDate: special.endDate,
      image: null
    });
    setImagePreview(special.imageUrl);
    editSpecialModal.open();
  };

  const handleEditSpecial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecial) return;

    const processUpdate = (imageUrl: string) => {
      const updatedSpecials = specials.map(s =>
        s.id === editingSpecial.id
          ? {
            ...s,
            title: specialForm.title,
            description: specialForm.description,
            startDate: specialForm.startDate,
            endDate: specialForm.endDate,
            imageUrl: imageUrl,
            fileName: specialForm.image?.name || s.fileName
          }
          : s
      );
      setSpecials(updatedSpecials);
      resetSpecialForm();
      editSpecialModal.close();
      alert('Special updated successfully!');
    };

    if (specialForm.image) {
      const reader = new FileReader();
      reader.onloadend = () => processUpdate(reader.result as string);
      reader.readAsDataURL(specialForm.image);
    } else {
      processUpdate(editingSpecial.imageUrl);
    }
  };

  const handleDeleteSpecial = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this special?');
    if (confirmed) {
      setSpecials(specials.filter(s => s.id !== id));
      alert('Special deleted successfully!');
    }
  };

  const resetSpecialForm = () => {
    setSpecialForm({ title: '', description: '', startDate: '', endDate: '', image: null });
    setImagePreview(null);
    setEditingSpecial(null);
  };

  // ==================== GALLERY ====================
  const handleGalleryImageSelect = (file: File) => {
    setImageForm({ ...imageForm, image: file });
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
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
      resetImageForm();
      uploadImageModal.close();
      alert('Image uploaded successfully!');
    };
    reader.readAsDataURL(imageForm.image);
  };

  const openEditImage = (img: GalleryImage) => {
    setEditingImage(img);
    setImageForm({
      category: img.category,
      title: img.title,
      description: img.description || '',
      image: null
    });
    setImagePreview(img.imageUrl);
    editImageModal.open();
  };

  const handleEditImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    const processUpdate = (imageUrl: string) => {
      const updatedImages = galleryImages.map(img =>
        img.id === editingImage.id
          ? {
            ...img,
            category: imageForm.category,
            title: imageForm.title,
            description: imageForm.description,
            imageUrl: imageUrl,
            fileName: imageForm.image?.name || img.fileName
          }
          : img
      );
      setGalleryImages(updatedImages);
      resetImageForm();
      editImageModal.close();
      alert('Image updated successfully!');
    };

    if (imageForm.image) {
      const reader = new FileReader();
      reader.onloadend = () => processUpdate(reader.result as string);
      reader.readAsDataURL(imageForm.image);
    } else {
      processUpdate(editingImage.imageUrl);
    }
  };

  const handleDeleteImage = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this image?');
    if (confirmed) {
      setGalleryImages(galleryImages.filter(img => img.id !== id));
      alert('Image deleted successfully!');
    }
  };

  const resetImageForm = () => {
    setImageForm({ category: 'cakes', title: '', description: '', image: null });
    setImagePreview(null);
    setEditingImage(null);
  };

  // ==================== USERS ====================
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

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
    resetUserForm();
    addUserModal.close();
    alert('User created successfully!');
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      email: user.email || '',
      password: '',
      securityQuestion: user.securityQuestion,
      securityAnswer: ''
    });
    editUserModal.open();
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUsers = users.map(u =>
      u.username === editingUser.username
        ? {
          ...u,
          email: userForm.email,
          password: userForm.password || u.password,
          securityQuestion: userForm.securityQuestion,
          securityAnswer: userForm.securityAnswer ? userForm.securityAnswer.toLowerCase().trim() : u.securityAnswer
        }
        : u
    );
    setUsers(updatedUsers);
    resetUserForm();
    editUserModal.close();
    alert('User updated successfully!');
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

  const resetUserForm = () => {
    setUserForm({ username: '', email: '', password: '', securityQuestion: '', securityAnswer: '' });
    setEditingUser(null);
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
              <a href="https://daniellelensly.github.io/Madbatter/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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
                <Button onClick={addSpecialModal.open}>+ Add Special</Button>
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
                        <div className={styles.cardActions}>
                          <Button size="small" onClick={() => openEditSpecial(special)}>
                            Edit
                          </Button>
                          <Button size="small" variant="danger" onClick={() => handleDeleteSpecial(special.id)}>
                            Delete
                          </Button>
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
                        <div className={styles.cardActions}>
                          <Button size="small" onClick={() => openEditImage(img)}>
                            Edit
                          </Button>
                          <Button size="small" variant="danger" onClick={() => handleDeleteImage(img.id)}>
                            Delete
                          </Button>
                        </div>
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
                    <div className={styles.cardActions}>
                      <Button size="small" onClick={() => openEditUser(user)}>
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeleteUser(user.username)}
                        disabled={users.length === 1}
                      >
                        Delete
                      </Button>
                    </div>
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
        onClose={() => { addSpecialModal.close(); resetSpecialForm(); }}
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

          <ImageUpload
            label="Image"
            required={true}
            preview={imagePreview}
            onImageSelect={handleSpecialImageSelect}
          />

          <Button type="submit" fullWidth>Add Special</Button>
        </form>
      </Modal>

      {/* Edit Special Modal */}
      <Modal
        isOpen={editSpecialModal.isOpen}
        onClose={() => { editSpecialModal.close(); resetSpecialForm(); }}
        title="Edit Special"
        maxWidth="700px"
      >
        <form onSubmit={handleEditSpecial} className={styles.form}>
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

          <ImageUpload
            label="Image (leave empty to keep current)"
            preview={imagePreview}
            onImageSelect={handleSpecialImageSelect}
          />

          <Button type="submit" fullWidth>Save Changes</Button>
        </form>
      </Modal>

      {/* Upload Image Modal */}
      <Modal
        isOpen={uploadImageModal.isOpen}
        onClose={() => { uploadImageModal.close(); resetImageForm(); }}
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

          <ImageUpload
            label="Image"
            required={true}
            preview={imagePreview}
            onImageSelect={handleGalleryImageSelect}
          />

          <Button type="submit" fullWidth>Upload Image</Button>
        </form>
      </Modal>

      {/* Edit Image Modal */}
      <Modal
        isOpen={editImageModal.isOpen}
        onClose={() => { editImageModal.close(); resetImageForm(); }}
        title="Edit Image"
        maxWidth="700px"
      >
        <form onSubmit={handleEditImage} className={styles.form}>
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

          <ImageUpload
            label="Image (leave empty to keep current)"
            preview={imagePreview}
            onImageSelect={handleGalleryImageSelect}
          />

          <Button type="submit" fullWidth>Save Changes</Button>
        </form>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={addUserModal.isOpen}
        onClose={() => { addUserModal.close(); resetUserForm(); }}
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

      {/* Edit User Modal */}
      <Modal
        isOpen={editUserModal.isOpen}
        onClose={() => { editUserModal.close(); resetUserForm(); }}
        title={`Edit User: ${editingUser?.username}`}
        maxWidth="700px"
      >
        <form onSubmit={handleEditUser} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              value={userForm.username}
              disabled
              className={styles.disabled}
            />
            <small>Username cannot be changed</small>
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={userForm.email}
              onChange={e => setUserForm({ ...userForm, email: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>New Password (leave empty to keep current)</label>
            <input
              type="password"
              value={userForm.password}
              onChange={e => setUserForm({ ...userForm, password: e.target.value })}
              placeholder="Enter new password"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Security Question</label>
            <input
              type="text"
              value={userForm.securityQuestion}
              onChange={e => setUserForm({ ...userForm, securityQuestion: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>New Security Answer (leave empty to keep current)</label>
            <input
              type="text"
              value={userForm.securityAnswer}
              onChange={e => setUserForm({ ...userForm, securityAnswer: e.target.value })}
              placeholder="Enter new security answer"
            />
          </div>

          <Button type="submit" fullWidth>Save Changes</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;
