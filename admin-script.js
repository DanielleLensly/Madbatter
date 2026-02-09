// ==================== Authentication Check ====================
// Check if user is authenticated
if (sessionStorage.getItem('adminAuthenticated') !== 'true') {
    window.location.href = 'login.html';
}

// Logout functionality
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                sessionStorage.removeItem('adminAuthenticated');
                sessionStorage.removeItem('adminUsername');
                sessionStorage.removeItem('loginTime');
                window.location.href = 'login.html';
            }
        });
    }
});

// ==================== Function Selector Navigation ====================
const functionSelect = document.getElementById('functionSelect');
const adminSections = document.querySelectorAll('.admin-section');

// Handle dropdown change
functionSelect.addEventListener('change', (e) => {
    const selectedFunction = e.target.value;
    
    // Hide all sections
    adminSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    if (selectedFunction) {
        const targetSection = document.getElementById(selectedFunction);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Smooth scroll to section
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
});

// ==================== Toast Notification System ====================
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.success}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// ==================== Specials Management ====================
class SpecialsManager {
    constructor() {
        this.storageKey = 'bakerySpecials';
        this.specials = this.loadSpecials();
    }

    loadSpecials() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveSpecials() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.specials));
    }

    addSpecial(specialData) {
        const newSpecial = {
            id: Date.now().toString(),
            ...specialData,
            createdDate: new Date().toISOString()
        };
        this.specials.unshift(newSpecial);
        this.saveSpecials();
        return newSpecial;
    }

    deleteSpecial(id) {
        this.specials = this.specials.filter(special => special.id !== id);
        this.saveSpecials();
    }

    getAllSpecials() {
        return this.specials;
    }
}

const specialsManager = new SpecialsManager();

// ==================== Special Upload Handling ====================
const specialForm = document.getElementById('specialForm');
const specialImageFile = document.getElementById('specialImageFile');
const specialFileUploadArea = document.getElementById('specialFileUploadArea');
const specialImagePreview = document.getElementById('specialImagePreview');
const specialUploadStatus = document.getElementById('specialUploadStatus');
const clearSpecialFormBtn = document.getElementById('clearSpecialForm');

let selectedSpecialFile = null;

// Drag and drop for special image
specialFileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    specialFileUploadArea.classList.add('dragover');
});

specialFileUploadArea.addEventListener('dragleave', () => {
    specialFileUploadArea.classList.remove('dragover');
});

specialFileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    specialFileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        specialImageFile.files = files;
        handleSpecialFileSelect(files[0]);
    }
});

specialImageFile.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleSpecialFileSelect(e.target.files[0]);
    }
});

function handleSpecialFileSelect(file) {
    if (!file.type.startsWith('image/')) {
        showSpecialStatus('Please select a valid image file.', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showSpecialStatus('Image size must be less than 5MB.', 'error');
        return;
    }

    selectedSpecialFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        specialImagePreview.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <p class="preview-name">${file.name}</p>
        `;
        specialImagePreview.classList.add('active');
    };
    reader.readAsDataURL(file);
}

// Special form submission
specialForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedSpecialFile) {
        showSpecialStatus('Please select an image.', 'error');
        return;
    }

    const title = document.getElementById('specialTitle').value || 'Untitled Special';
    const description = document.getElementById('specialDescription').value || 'No description';
    const startDate = document.getElementById('specialStartDate').value;
    const endDate = document.getElementById('specialEndDate').value;

    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
        showSpecialStatus('End date must be after start date.', 'error');
        return;
    }

    // Confirmation before creating
    const confirmMsg = 'Are you sure you want to create this special?\n\nTitle: ' + title + '\nDates: ' + startDate + ' to ' + endDate + '\n\nClick OK to create.';
    if (!confirm(confirmMsg)) {
        return;
    }

    const submitBtn = specialForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Creating...';
    submitBtn.disabled = true;

    try {
        const reader = new FileReader();
        reader.onload = (e) => {
            const specialData = {
                title: title,
                description: description,
                startDate: startDate,
                endDate: endDate,
                imageUrl: e.target.result,
                fileName: selectedSpecialFile.name
            };

            specialsManager.addSpecial(specialData);
            showToast('Special created successfully! ✨', 'success');

            // Reset form
            specialForm.reset();
            specialImagePreview.classList.remove('active');
            specialImagePreview.innerHTML = '';
            selectedSpecialFile = null;

            // Update dropdown and gallery
            updateSpecialsDropdown();
            displaySpecialsGallery();
        };

        reader.readAsDataURL(selectedSpecialFile);

    } catch (error) {
        showSpecialStatus('Creation failed. Please try again.', 'error');
        console.error('Special creation error:', error);
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Clear special form
clearSpecialFormBtn.addEventListener('click', () => {
    specialForm.reset();
    specialImagePreview.classList.remove('active');
    specialImagePreview.innerHTML = '';
    selectedSpecialFile = null;
    specialUploadStatus.style.display = 'none';
});

function showSpecialStatus(message, type) {
    specialUploadStatus.className = `form-status ${type}`;
    specialUploadStatus.textContent = message;
    specialUploadStatus.style.display = 'block';

    setTimeout(() => {
        specialUploadStatus.style.display = 'none';
    }, 5000);
}

// ==================== Cancel Special Functionality ====================
const specialToCancel = document.getElementById('specialToCancel');
const cancelSpecialBtn = document.getElementById('cancelSpecialBtn');

function updateSpecialsDropdown() {
    const specials = specialsManager.getAllSpecials();
    
    if (specials.length === 0) {
        specialToCancel.innerHTML = '<option value="">No specials available</option>';
        cancelSpecialBtn.disabled = true;
        return;
    }

    specialToCancel.innerHTML = '<option value="">Select a special...</option>' +
        specials.map(special => {
            const startDate = new Date(special.startDate).toLocaleDateString();
            const endDate = new Date(special.endDate).toLocaleDateString();
            const title = special.title || 'Untitled Special';
            return `<option value="${special.id}">${title} (${startDate} - ${endDate})</option>`;
        }).join('');
    
    // Don't enable button until user selects something
    cancelSpecialBtn.disabled = true;
}

specialToCancel.addEventListener('change', () => {
    cancelSpecialBtn.disabled = !specialToCancel.value;
});

cancelSpecialBtn.addEventListener('click', () => {
    const specialId = specialToCancel.value;
    
    if (!specialId) {
        showSpecialStatus('Please select a special to cancel.', 'error');
        return;
    }

    const selectedOption = specialToCancel.options[specialToCancel.selectedIndex];
    const specialName = selectedOption.text;

    const confirmMsg = 'Are you sure you want to cancel "' + specialName + '"?\n\nThis action cannot be undone.';
    if (confirm(confirmMsg)) {
        try {
            specialsManager.deleteSpecial(specialId);
            showToast('Special cancelled successfully!', 'success');
            
            // Update dropdown and reset
            updateSpecialsDropdown();
            displaySpecialsGallery();
            specialToCancel.value = '';
            cancelSpecialBtn.disabled = true;
        } catch (error) {
            console.error('Error cancelling special:', error);
            showSpecialStatus('Failed to cancel special. Please try again.', 'error');
        }
    }
});

// Initialize dropdown on page load
document.addEventListener('DOMContentLoaded', () => {
    updateSpecialsDropdown();
    displaySpecialsGallery();
});

// ==================== Display Specials Gallery ====================
function displaySpecialsGallery() {
    const specialsGallery = document.getElementById('specialsGallery');
    const specials = specialsManager.getAllSpecials();
    
    if (specials.length === 0) {
        specialsGallery.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🎉</span>
                <h3>No specials created yet</h3>
                <p>Create your first special above!</p>
            </div>
        `;
        return;
    }
    
    specialsGallery.innerHTML = specials.map((special, index) => `
        <div class="admin-gallery-item" style="animation-delay: ${index * 0.1}s">
            <img src="${special.imageUrl}" alt="${special.title}" class="gallery-item-image">
            <div class="gallery-item-info">
                <span class="gallery-item-category">Special Offer</span>
                <p class="gallery-item-description"><strong>${special.title || 'Untitled Special'}</strong></p>
                ${special.description ? `<p class="gallery-item-description" style="font-size: 0.875rem; opacity: 0.8;">${special.description}</p>` : ''}
                <p class="gallery-item-date">📅 ${new Date(special.startDate).toLocaleDateString()} - ${new Date(special.endDate).toLocaleDateString()}</p>
                <div class="gallery-item-actions">
                    <button class="btn btn-danger btn-small" onclick="confirmDeleteSpecial('${special.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function confirmDeleteSpecial(specialId) {
    const special = specialsManager.getAllSpecials().find(s => s.id === specialId);
    if (!special) return;
    
    const confirmMsg = 'Are you sure you want to delete "' + (special.title || 'Untitled Special') + '"?\n\nThis action cannot be undone.';
    if (confirm(confirmMsg)) {
        specialsManager.deleteSpecial(specialId);
        displaySpecialsGallery();
        updateSpecialsDropdown();
        showToast('Special deleted successfully!', 'success');
    }
}

// ==================== Gallery Storage Manager ====================
class GalleryManager {
    constructor() {
        this.storageKey = 'bakeryGallery';
        this.images = this.loadImages();
    }

    loadImages() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveImages() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.images));
    }

    addImage(imageData) {
        const newImage = {
            id: Date.now().toString(),
            ...imageData,
            uploadDate: new Date().toISOString()
        };
        this.images.unshift(newImage);
        this.saveImages();
        return newImage;
    }

    deleteImage(id) {
        this.images = this.images.filter(img => img.id !== id);
        this.saveImages();
    }

    getImagesByCategory(category) {
        if (category === 'all') return this.images;
        return this.images.filter(img => img.category === category);
    }

    getCategoryCount() {
        const categories = new Set(this.images.map(img => img.category));
        return categories.size;
    }
}

const galleryManager = new GalleryManager();

// Helper function - define before use
function getCategoryName(category) {
    const categoryNames = {
        'cakes': 'Custom Cakes',
        'cupcakes': 'Gourmet Cupcakes',
        'cakesicles': 'Cakesicles',
        'treatboxes': 'Treat Boxes',
        'cookies': 'Handcrafted Cookies',
        'desserts': 'Decadent Desserts',
        'biscotti': 'Artisan Biscotti',
        'meals': 'Homestyle Meals',
        'bento': 'Bento Cakes',
        'smash': 'Smash Cakes',
        'occasions': 'Special Occasions',
        'treats': 'Sweet Treats',
        'specials': 'Special Offers'
    };
    return categoryNames[category] || category;
}

// ==================== File Upload Handling ====================
const uploadForm = document.getElementById('uploadForm');
const imageFileInput = document.getElementById('imageFile');
const fileUploadArea = document.getElementById('fileUploadArea');
const imagePreview = document.getElementById('imagePreview');
const uploadStatus = document.getElementById('uploadStatus');
const clearFormBtn = document.getElementById('clearForm');

let selectedFile = null;

// Drag and drop functionality
fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        imageFileInput.files = files;
        handleFileSelect(files[0]);
    }
});

// File input change
imageFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showStatus('Please select a valid image file.', 'error');
        return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showStatus('Image size must be less than 5MB.', 'error');
        return;
    }

    selectedFile = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <p class="preview-name">${file.name}</p>
        `;
        imagePreview.classList.add('active');
    };
    reader.readAsDataURL(file);
}

// Form submission
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Upload form submitted');

    if (!selectedFile) {
        console.log('No file selected');
        showStatus('Please select an image to upload.', 'error');
        return;
    }

    const category = document.getElementById('category').value;
    const title = document.getElementById('imageTitle').value.trim();
    const description = document.getElementById('description').value || 'Beautiful creation';

    console.log('Form data:', { category, title, description });

    if (!title) {
        console.log('No title entered');
        showStatus('Please enter a title for your image.', 'error');
        return;
    }

    // Confirmation before upload
    console.log('About to show confirmation dialog');
    const categoryName = getCategoryName(category);
    const confirmMsg = 'Are you sure you want to upload this image?\n\nTitle: ' + title + '\nCategory: ' + categoryName + '\n\nClick OK to upload.';
    console.log('Confirmation message:', confirmMsg);
    
    const userConfirmed = confirm(confirmMsg);
    console.log('User confirmed:', userConfirmed);
    
    if (!userConfirmed) {
        console.log('User cancelled upload');
        return;
    }

    console.log('Starting upload process');

    // Show loading state
    const submitBtn = uploadForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Uploading...';
    submitBtn.disabled = true;

    try {
        // Convert image to base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                category: category,
                title: title,
                description: description,
                imageUrl: e.target.result,
                fileName: selectedFile.name
            };

            // Add to gallery
            galleryManager.addImage(imageData);

            // Show success
            showToast('Image uploaded successfully! ✨', 'success');

            // Reset form
            uploadForm.reset();
            imagePreview.classList.remove('active');
            imagePreview.innerHTML = '';
            selectedFile = null;

            // Refresh gallery display
            displayGallery();
            updateStats();

            // Scroll to gallery
            setTimeout(() => {
                document.getElementById('manage').scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        };

        reader.readAsDataURL(selectedFile);

    } catch (error) {
        showStatus('Upload failed. Please try again.', 'error');
        console.error('Upload error:', error);
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Clear form
clearFormBtn.addEventListener('click', () => {
    // Confirmation before clearing
    const confirmMsg = 'Are you sure you want to clear the form?\n\nAll entered information and the selected image will be lost.\n\nClick OK to clear.';
    if (!confirm(confirmMsg)) {
        return;
    }
    
    uploadForm.reset();
    imagePreview.classList.remove('active');
    imagePreview.innerHTML = '';
    selectedFile = null;
    uploadStatus.style.display = 'none';
});

function showStatus(message, type) {
    uploadStatus.className = `form-status ${type}`;
    uploadStatus.textContent = message;
    uploadStatus.style.display = 'block';

    setTimeout(() => {
        uploadStatus.style.display = 'none';
    }, 5000);
}

// ==================== Gallery Display ====================
const adminGallery = document.getElementById('adminGallery');
const filterBtns = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

// Category images from folders (same as in script.js)
const categoryImages = {
    cakes: [
        'baby-cake.jpg', 'baley-cake.jpg', 'black-panther-cake.jpg', 'blue-cake.jpg',
        'blue-glitter-cake.jpg', 'buttercream-cake.jpg', 'car-cake.jpg', 'cricket-cake.jpg',
        'death-by-chocolate-cake.jpg', 'denim-cake.jpg', 'dnd-cake.jpg', 'flower-cake.jpg',
        'frozen-cake.jpg', 'hello-kitty-cake.jpg', 'mermaid-cake.jpg', 'mom-birthday-cake.jpg',
        'oreo-cookies.jpg', 'pick-cake.jpg', 'pink-flower-cake.jpg', 'shiny-pink-cake.jpg',
        'strawberry-cake.jpg', 'white-gold-sparkle-cake.jpg'
    ],
    cupcakes: [
        'blue-green-white-purple-cupcakes.jpg', 'blue-pink-cupcakes.jpg', 'blue-purple-cupcakes.jpg',
        'blue-white-cupcakes.jpg', 'chocolate-cupcakes.jpg', 'cupcakes.jpg', 'green-cupcakes.jpg',
        'pink-blue-cupcakes.jpg', 'pink-cupcakes.jpg', 'pink-white-cupcakes.jpg',
        'purple-cupcakes.jpg', 'succulent-cupcakes.jpg', 'tools-cupcakes.jpg'
    ],
    cakesicles: [
        'cakesicle-treats.jpg', 'cricket-cakesicles.jpg', 'frozen-cakesicles.jpg',
        'halloween-cakesicles.jpg', 'pink-blue-cakesicles.jpg', 'pink-cakesicles.jpg',
        'purple-cakesicles.jpg'
    ],
    treatboxes: [
        '16-treat-box.jpg', 'denim-treats.jpg', 'mix-cookies-box.jpg', 'pokemon-treats-1.jpg',
        'star-wars-treats.jpg', 'treats-1.jpg', 'treats-2.jpg', 'treats-3.jpg', 'tyler-treat-box.jpg'
    ],
    cookies: [
        'batman-cookies.jpg', 'choco-oreo-cookies.jpg', 'cookies.jpg', 'easter-cookies.jpg',
        'halloween-cookies.jpg', 'heart-cookies.jpg', 'xmas-cookies.jpg', 'yellow-cookies.jpg'
    ],
    desserts: [
        'dessert-1.jpg', 'dessert-2.jpg', 'dessert-3.jpg', 'dessert-4.jpg',
        'dessert-5.jpg', 'dessert-6.jpg', 'dessert.jpg'
    ],
    biscotti: ['admond-cranberry-biscotti.jpg'],
    meals: [
        'meal-1.jpg', 'meal-10.jpg', 'meal-11.jpg', 'meal-13.jpg', 'meal-18.jpg',
        'meal-2.jpg', 'meal-3.jpg', 'meal-4.jpg', 'meal-5.jpg', 'meal-6.jpg',
        'meal-7.jpg', 'meal-8.jpg', 'meal-9.jpg', 'meal.jpg'
    ],
    bento: ['bento-blue.jpg', 'bento-pink.jpg'],
    smash: ['birthday-smash.jpg', 'bunny-butt-smash.jpg', 'smash-hearts.jpg'],
    occasions: [
        'easter-donuts.jpg', 'easter-egg.jpg', 'easter-treat-box-1.jpg', 'easter-treat-box.jpg',
        'halloween-house.jpg', 'rose-pink-cakesicles.jpg', 'valentines-box-1.jpg',
        'valentines-box-2.jpg', 'valentines-box-3.jpg', 'valentines-box-4.jpg',
        'valentines-box-5.jpg', 'valentines-box-6.jpg', 'valentines-box-7.jpg',
        'valentines-box-8.jpg', 'valentines-box.jpg', 'valentines-treat-box-1.jpg',
        'valentines-treat-box.jpg', 'xmas-box-1.jpg', 'xmas-box.jpg', 'xmas-cakesicles.jpg'
    ],
    treats: [
        'grogu-choc-bomb.jpg', 'hazelnut-fudge-treats.jpg', 'marshmallow-fudge.jpg',
        'peppermint-crisp-treats.jpg', 'treats-table-1.jpg', 'treats-table.jpg',
        'turkish-delight-treats.jpg', 'unicorn-choco-bomb.jpg'
    ]
};

// Folder names mapping
const categoryFolders = {
    cakes: 'cakes',
    cupcakes: 'cupcakes',
    cakesicles: 'cakesicles',
    treatboxes: 'treat boxes',
    cookies: 'cookies',
    desserts: 'desserts',
    biscotti: 'biscotti',
    meals: 'meals',
    bento: 'bento',
    smash: 'smash',
    occasions: 'occasions',
    treats: 'treats'
};

function displayGallery(filter = 'all') {
    // Get uploaded images
    const uploadedImages = galleryManager.getImagesByCategory(filter);
    
    // Get folder images based on filter
    const allImages = [];
    
    if (filter === 'all') {
        // Add all folder images from all categories
        Object.keys(categoryImages).forEach(category => {
            const folderName = categoryFolders[category];
            categoryImages[category].forEach(filename => {
                allImages.push({
                    imageUrl: `images/${folderName}/${filename}`,
                    title: filename.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    description: '',
                    category: category,
                    uploadDate: null,
                    isFromFolder: true,
                    id: `folder-${category}-${filename}`
                });
            });
        });
        
        // Add all specials
        const allSpecials = specialsManager.getAllSpecials();
        allSpecials.forEach(special => {
            allImages.push({
                imageUrl: special.imageUrl,
                title: special.title || 'Untitled Special',
                description: special.description || '',
                category: 'specials',
                uploadDate: special.createdDate,
                startDate: special.startDate,
                endDate: special.endDate,
                isFromFolder: false,
                isSpecial: true,
                id: special.id
            });
        });
    } else if (filter === 'specials') {
        // Show only specials
        const allSpecials = specialsManager.getAllSpecials();
        allSpecials.forEach(special => {
            allImages.push({
                imageUrl: special.imageUrl,
                title: special.title || 'Untitled Special',
                description: special.description || '',
                category: 'specials',
                uploadDate: special.createdDate,
                startDate: special.startDate,
                endDate: special.endDate,
                isFromFolder: false,
                isSpecial: true,
                id: special.id
            });
        });
    } else {
        // Add folder images for specific category
        const folderName = categoryFolders[filter];
        const folderImages = categoryImages[filter] || [];
        folderImages.forEach(filename => {
            allImages.push({
                imageUrl: `images/${folderName}/${filename}`,
                title: filename.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                description: '',
                category: filter,
                uploadDate: null,
                isFromFolder: true,
                id: `folder-${filter}-${filename}`
            });
        });
    }
    
    // Add uploaded images
    uploadedImages.forEach(img => {
        allImages.push({
            ...img,
            isFromFolder: false
        });
    });

    if (allImages.length === 0) {
        adminGallery.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🎨</span>
                <h3>No images ${filter !== 'all' ? 'in this category' : 'available'}</h3>
                <p>${filter !== 'all' ? 'Try selecting a different category!' : 'No images found!'}</p>
            </div>
        `;
        return;
    }

    adminGallery.innerHTML = allImages.map((img, index) => `
        <div class="admin-gallery-item" style="animation-delay: ${index * 0.1}s">
            <img src="${img.imageUrl}" alt="${img.title || img.description}" class="gallery-item-image" onerror="this.parentElement.style.display='none'">
            <div class="gallery-item-info">
                <span class="gallery-item-category">${getCategoryName(img.category)}</span>
                ${img.isSpecial ? '<span class="gallery-item-badge" style="background: var(--color-accent); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem;">SPECIAL</span>' : (!img.isFromFolder ? '<span class="gallery-item-badge" style="background: var(--color-success); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem;">NEW</span>' : '')}
                <p class="gallery-item-description"><strong>${img.title || 'Untitled'}</strong></p>
                ${img.description ? `<p class="gallery-item-description" style="font-size: 0.875rem; opacity: 0.8;">${img.description}</p>` : ''}
                ${img.startDate && img.endDate ? `<p class="gallery-item-date">📅 ${new Date(img.startDate).toLocaleDateString()} - ${new Date(img.endDate).toLocaleDateString()}</p>` : (img.uploadDate ? `<p class="gallery-item-date">📅 ${formatDate(img.uploadDate)}</p>` : '')}
                <div class="gallery-item-actions">
                    ${img.isSpecial ? `<button class="btn btn-primary btn-small" onclick="editSpecial('${img.id}')" style="background: var(--color-accent);">✏️ Edit</button>` : ''}
                    <button class="btn btn-danger btn-small" onclick="confirmDelete('${img.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}
function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentFilter = btn.dataset.category;
        displayGallery(currentFilter);
    });
});

// ==================== Statistics ====================
function updateStats() {
    // Count uploaded images
    const uploadedCount = galleryManager.images.length;
    
    // Count folder images
    let folderImageCount = 0;
    Object.keys(categoryImages).forEach(category => {
        folderImageCount += categoryImages[category].length;
    });
    
    // Count specials
    const specialsCount = specialsManager.getAllSpecials().length;
    
    // Total images (folder + uploaded + specials)
    const totalImages = uploadedCount + folderImageCount + specialsCount;
    
    document.getElementById('totalImages').textContent = totalImages;
    // Show total number of categories (12 + specials = 13)
    document.getElementById('categoryCount').textContent = Object.keys(categoryImages).length + 1;
}

// ==================== Delete Functionality ====================
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
let imageToDelete = null;

function confirmDelete(imageId) {
    imageToDelete = imageId;
    deleteModal.classList.add('active');
}

confirmDeleteBtn.addEventListener('click', () => {
    if (imageToDelete) {
        // Check if it's a special
        const special = specialsManager.getAllSpecials().find(s => s.id === imageToDelete);
        if (special) {
            // It's a special
            specialsManager.deleteSpecial(imageToDelete);
            showToast('Special deleted successfully!', 'success');
        } else if (imageToDelete.startsWith('folder-')) {
            // Extract category and filename from folder image ID
            const parts = imageToDelete.replace('folder-', '').split('-');
            const category = parts[0];
            const filename = parts.slice(1).join('-');
            
            // Remove from categoryImages array
            const index = categoryImages[category].indexOf(filename);
            if (index > -1) {
                categoryImages[category].splice(index, 1);
            }
            
            showToast('Image deleted successfully!', 'success');
        } else {
            // It's an uploaded image
            const image = galleryManager.images.find(img => img.id === imageToDelete);
            const categoryName = getCategoryName(image?.category || '');
            
            galleryManager.deleteImage(imageToDelete);
            showToast(`Image from "${categoryName}" deleted successfully!`, 'success');
        }
        
        displayGallery(currentFilter);
        updateStats();
        deleteModal.classList.remove('active');
        imageToDelete = null;
    }
});
cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('active');
    imageToDelete = null;
});

// Close modal when clicking outside
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
        imageToDelete = null;
    }
});

// ==================== Edit Special Functionality ====================
const editSpecialModal = document.getElementById('editSpecialModal');
const editSpecialForm = document.getElementById('editSpecialForm');
const editSpecialImage = document.getElementById('editSpecialImage');
const editSpecialFileUploadArea = document.getElementById('editSpecialFileUploadArea');
const editSpecialImagePreview = document.getElementById('editSpecialImagePreview');
const cancelEditSpecialBtn = document.getElementById('cancelEditSpecial');

let currentEditingSpecialId = null;
let editSpecialSelectedFile = null;

// Edit special function
function editSpecial(specialId) {
    const special = specialsManager.getAllSpecials().find(s => s.id === specialId);
    if (!special) return;
    
    currentEditingSpecialId = specialId;
    
    // Populate form
    document.getElementById('editSpecialTitle').value = special.title || '';
    document.getElementById('editSpecialDescription').value = special.description || '';
    document.getElementById('editSpecialStartDate').value = special.startDate || '';
    document.getElementById('editSpecialEndDate').value = special.endDate || '';
    
    // Show current image
    editSpecialImagePreview.innerHTML = `
        <img src="${special.imageUrl}" alt="Current image" style="max-width: 100%; max-height: 200px; border-radius: var(--radius-md);">
        <p class="preview-name">Current Image</p>
    `;
    editSpecialImagePreview.classList.add('active');
    
    editSpecialModal.classList.add('active');
}

// Handle image selection for edit
editSpecialImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        editSpecialSelectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            editSpecialImagePreview.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: var(--radius-md);">
                <p class="preview-name">${file.name}</p>
            `;
            editSpecialImagePreview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }
});

// Drag and drop for edit
editSpecialFileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    editSpecialFileUploadArea.classList.add('dragover');
});

editSpecialFileUploadArea.addEventListener('dragleave', () => {
    editSpecialFileUploadArea.classList.remove('dragover');
});

editSpecialFileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    editSpecialFileUploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        editSpecialImage.files = e.dataTransfer.files;
        editSpecialImage.dispatchEvent(new Event('change'));
    }
});

// Handle edit form submission
editSpecialForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const special = specialsManager.getAllSpecials().find(s => s.id === currentEditingSpecialId);
    if (!special) return;
    
    const title = document.getElementById('editSpecialTitle').value;
    const description = document.getElementById('editSpecialDescription').value;
    const startDate = document.getElementById('editSpecialStartDate').value;
    const endDate = document.getElementById('editSpecialEndDate').value;
    
    // Update special data
    special.title = title;
    special.description = description;
    special.startDate = startDate;
    special.endDate = endDate;
    
    // If new image selected, update it
    if (editSpecialSelectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            special.imageUrl = e.target.result;
            
            // Save and update
            specialsManager.saveSpecials();
            displayGallery(currentFilter);
            displaySpecialsGallery();
            updateStats();
            
            showToast('Special updated successfully! ✨', 'success');
            
            // Close modal and reset
            editSpecialModal.classList.remove('active');
            editSpecialForm.reset();
            editSpecialImagePreview.classList.remove('active');
            editSpecialImagePreview.innerHTML = '';
            editSpecialSelectedFile = null;
            currentEditingSpecialId = null;
        };
        reader.readAsDataURL(editSpecialSelectedFile);
    } else {
        // No new image, just save
        specialsManager.saveSpecials();
        displayGallery(currentFilter);
        displaySpecialsGallery();
        updateStats();
        
        showToast('Special updated successfully! ✨', 'success');
        
        // Close modal and reset
        editSpecialModal.classList.remove('active');
        editSpecialForm.reset();
        editSpecialImagePreview.classList.remove('active');
        editSpecialImagePreview.innerHTML = '';
        editSpecialSelectedFile = null;
        currentEditingSpecialId = null;
    }
});

// Cancel edit
cancelEditSpecialBtn.addEventListener('click', () => {
    editSpecialModal.classList.remove('active');
    editSpecialForm.reset();
    editSpecialImagePreview.classList.remove('active');
    editSpecialImagePreview.innerHTML = '';
    editSpecialSelectedFile = null;
    currentEditingSpecialId = null;
});

// Close modal when clicking outside
editSpecialModal.addEventListener('click', (e) => {
    if (e.target === editSpecialModal) {
        editSpecialModal.classList.remove('active');
        editSpecialForm.reset();
        editSpecialImagePreview.classList.remove('active');
        editSpecialImagePreview.innerHTML = '';
        editSpecialSelectedFile = null;
        currentEditingSpecialId = null;
    }
});

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    displayGallery();
    updateStats();
    displayUsers();
});

// ==================== User Management ====================
const userManager = new UserManager();
const createUserForm = document.getElementById('createUserForm');
const usersList = document.getElementById('usersList');

// Display users
function displayUsers() {
    if (!usersList) return;
    
    const users = userManager.getAllUsers();
    const currentUsername = sessionStorage.getItem('adminUsername');
    
    if (users.length === 0) {
        usersList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">👤</span>
                <h3>No users found</h3>
                <p>Create your first user above!</p>
            </div>
        `;
        return;
    }
    
    usersList.innerHTML = users.map(user => `
        <div class="user-card">
            <div class="user-info">
                <div class="user-name">
                    ${user.username}
                    ${user.username === currentUsername ? ' (You)' : ''}
                </div>
                <div class="user-details">
                    <span class="user-badge ${user.role}">${user.role}</span>
                    ${user.email ? `<span>📧 ${user.email}</span>` : ''}
                    <span>📅 Created ${new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="user-actions">
                ${user.username !== currentUsername ? `
                    <button class="btn btn-danger btn-small" onclick="deleteUser('${user.id}', '${user.username}')">
                        🗑️ Delete
                    </button>
                ` : '<span style="color: var(--color-gray); font-size: 0.875rem;">Current User</span>'}
            </div>
        </div>
    `).join('');
}

// Create new user
if (createUserForm) {
    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userData = {
            username: document.getElementById('newUsername').value.trim(),
            email: document.getElementById('newEmail').value.trim(),
            password: document.getElementById('newUserPassword').value,
            role: document.getElementById('newUserRole').value,
            securityQuestion: document.getElementById('newSecurityQuestion').value.trim(),
            securityAnswer: document.getElementById('newSecurityAnswer').value.trim()
        };
        
        const result = userManager.createUser(userData);
        
        if (result.success) {
            showToast(`User "${userData.username}" created successfully! ✨`, 'success');
            createUserForm.reset();
            displayUsers();
        } else {
            showToast(`Error: ${result.error}`, 'error');
        }
    });
}

// Delete user
function deleteUser(userId, username) {
    if (confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
        if (userManager.deleteUser(userId)) {
            showToast(`User "${username}" deleted successfully.`, 'success');
            displayUsers();
        } else {
            showToast('Failed to delete user.', 'error');
        }
    }
}

// ==================== Security Question Management ====================
const updateSecurityBtn = document.getElementById('updateSecurityBtn');
const updateSecurityForm = document.getElementById('updateSecurityForm');
const cancelUpdateSecurity = document.getElementById('cancelUpdateSecurity');
const displaySecurityQuestion = document.getElementById('displaySecurityQuestion');

// Display current security question
function displayCurrentSecurityQuestion() {
    if (!displaySecurityQuestion) return;
    
    const currentUsername = sessionStorage.getItem('adminUsername');
    const user = userManager.findUser(currentUsername);
    
    if (user && user.securityQuestion) {
        displaySecurityQuestion.textContent = user.securityQuestion;
    } else {
        displaySecurityQuestion.textContent = 'No security question set';
    }
}

// Show/hide update form
if (updateSecurityBtn) {
    updateSecurityBtn.addEventListener('click', () => {
        updateSecurityForm.style.display = 'block';
        updateSecurityBtn.style.display = 'none';
    });
}

if (cancelUpdateSecurity) {
    cancelUpdateSecurity.addEventListener('click', () => {
        updateSecurityForm.style.display = 'none';
        updateSecurityBtn.style.display = 'block';
        updateSecurityForm.reset();
    });
}

// Handle security question update
if (updateSecurityForm) {
    updateSecurityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentUsername = sessionStorage.getItem('adminUsername');
        const newQuestion = document.getElementById('updateSecurityQuestion').value.trim();
        const newAnswer = document.getElementById('updateSecurityAnswer').value.trim();
        
        if (userManager.updateSecurityQuestion(currentUsername, newQuestion, newAnswer)) {
            showToast('Security question updated successfully! ✨', 'success');
            updateSecurityForm.style.display = 'none';
            updateSecurityBtn.style.display = 'block';
            updateSecurityForm.reset();
            displayCurrentSecurityQuestion();
        } else {
            showToast('Failed to update security question.', 'error');
        }
    });
}

// Initialize security question display
displayCurrentSecurityQuestion();

// ==================== Export for Main Website ====================
// This function can be called from the main website to get gallery images
window.getBakeryGallery = function(category = 'all') {
    return galleryManager.getImagesByCategory(category);
};
