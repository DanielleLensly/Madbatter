// ==================== Mobile Menu Toggle ====================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ==================== Navbar Scroll Effect ====================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Enhanced shadow on scroll
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        navbar.style.background = '#ffffff';
    }
    
    lastScroll = currentScroll;
});

// ==================== Active Nav Link Highlighting ====================
const navSections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    navSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== Smooth Scroll with Offset ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== Contact Form Handling ====================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const thankYouModal = document.getElementById('thankYouModal');
const closeThankYouBtn = document.getElementById('closeThankYou');
const countdownElement = document.getElementById('countdown');
const countdownProgress = document.getElementById('countdownProgress');

let countdownInterval;
let redirectTimeout;

// Function to show thank you modal with countdown
function showThankYouModal() {
    thankYouModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    let timeLeft = 10;
    countdownElement.textContent = timeLeft;
    countdownProgress.style.width = '100%';
    
    // Update countdown every second
    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        countdownProgress.style.width = `${(timeLeft / 10) * 100}%`;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            redirectToHome();
        }
    }, 1000);
    
    // Set timeout for redirect (backup)
    redirectTimeout = setTimeout(() => {
        redirectToHome();
    }, 10000);
}

// Function to redirect to homepage
function redirectToHome() {
    clearInterval(countdownInterval);
    clearTimeout(redirectTimeout);
    window.location.href = '#home';
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Close modal after a brief delay
    setTimeout(() => {
        thankYouModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }, 500);
}

// Close button handler
closeThankYouBtn.addEventListener('click', () => {
    redirectToHome();
});

// Close modal when clicking outside
thankYouModal.addEventListener('click', (e) => {
    if (e.target === thankYouModal) {
        redirectToHome();
    }
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const phoneInput = document.getElementById('phone');
    const phoneValue = phoneInput.value.trim();
    
    // Validate phone number if provided
    let formattedPhone = '';
    if (phoneValue) {
        const phoneValidation = validatePhoneNumber(phoneValue);
        if (!phoneValidation.isValid) {
            // Show error and prevent submission
            phoneInput.style.borderColor = '#721c24';
            const formGroup = phoneInput.closest('.form-group');
            const existingError = formGroup.querySelector('.phone-error');
            if (existingError) existingError.remove();
            
            const errorElement = document.createElement('small');
            errorElement.className = 'phone-error';
            errorElement.textContent = phoneValidation.error;
            const hint = formGroup.querySelector('.phone-hint');
            if (hint) {
                hint.after(errorElement);
            } else {
                formGroup.appendChild(errorElement);
            }
            return;
        }
        formattedPhone = phoneValidation.formattedNumber;
    }
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: formattedPhone,
        message: document.getElementById('message').value
    };
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual backend endpoint)
    try {
        // In a real application, you would send this to a backend API
        // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        
        // Reset form
        contactForm.reset();
        
        // Show thank you modal with countdown
        showThankYouModal();
        
    } catch (error) {
        // Show error message
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Oops! Something went wrong. Please try again or contact me directly.';
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    } finally {
        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

// ==================== Scroll Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and gallery items
document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== Gallery Image Modal (Optional Enhancement) ====================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Add a subtle scale effect on click
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 200);
    });
});

// ==================== Active Navigation Link ====================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== Form Input Animations ====================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateX(4px)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateX(0)';
    });
});

// ==================== Current Specials Loading ====================
function loadSpecials() {
    const currentSpecialsGrid = document.getElementById('currentSpecialsGrid');
    const upcomingSpecialsGrid = document.getElementById('upcomingSpecialsGrid');
    const pastSpecialsGrid = document.getElementById('pastSpecialsGrid');
    
    if (!currentSpecialsGrid || !upcomingSpecialsGrid || !pastSpecialsGrid) return;
    
    const storedSpecials = localStorage.getItem('bakerySpecials');
    const allSpecials = storedSpecials ? JSON.parse(storedSpecials) : [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter current specials (active today)
    const currentSpecials = allSpecials.filter(special => {
        const startDate = new Date(special.startDate);
        const endDate = new Date(special.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        return today >= startDate && today <= endDate;
    });
    
    // Filter upcoming specials (start date is in the future)
    const upcomingSpecials = allSpecials.filter(special => {
        const startDate = new Date(special.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        return today < startDate;
    });
    
    // Filter past specials (end date is in the past)
    const pastSpecials = allSpecials.filter(special => {
        const endDate = new Date(special.endDate);
        endDate.setHours(23, 59, 59, 999);
        
        return today > endDate;
    });
    
    // Display current specials
    if (currentSpecials.length === 0) {
        currentSpecialsGrid.innerHTML = `
            <div class="specials-empty-state">
                <span class="empty-icon">🎉</span>
                <h3>No Active Specials</h3>
                <p>Check back soon for amazing deals!</p>
            </div>
        `;
    } else {
        currentSpecialsGrid.innerHTML = currentSpecials.map((special, index) => `
            <div class="special-card" style="animation-delay: ${index * 0.1}s">
                <span class="special-badge">Special Offer</span>
                <div class="special-image-container">
                    <img src="${special.imageUrl}" alt="${special.title}" class="special-image">
                </div>
                <div class="special-content">
                    <h3 class="special-title">${special.title}</h3>
                    ${special.description ? `<p class="special-description">${special.description}</p>` : ''}
                    <div class="special-dates">
                        <span class="special-dates-icon">📅</span>
                        <span>${formatSpecialDate(special.startDate)} - ${formatSpecialDate(special.endDate)}</span>
                    </div>
                    <a href="#contact" class="special-cta">
                        Order Now →
                    </a>
                </div>
            </div>
        `).join('');
    }
    
    // Display upcoming specials
    if (upcomingSpecials.length === 0) {
        upcomingSpecialsGrid.innerHTML = `
            <div class="specials-empty-state">
                <span class="empty-icon">⏰</span>
                <h3>No Upcoming Specials</h3>
                <p>Stay tuned for exciting new offers!</p>
            </div>
        `;
    } else {
        upcomingSpecialsGrid.innerHTML = upcomingSpecials.map((special, index) => `
            <div class="special-card" style="animation-delay: ${index * 0.1}s">
                <span class="special-badge" style="background: linear-gradient(135deg, #3498db, #2980b9);">Coming Soon</span>
                <div class="special-image-container">
                    <img src="${special.imageUrl}" alt="${special.title}" class="special-image">
                </div>
                <div class="special-content">
                    <h3 class="special-title">${special.title}</h3>
                    ${special.description ? `<p class="special-description">${special.description}</p>` : ''}
                    <div class="special-dates">
                        <span class="special-dates-icon">📅</span>
                        <span>Starts ${formatSpecialDate(special.startDate)}</span>
                    </div>
                    <div class="special-dates" style="margin-top: var(--spacing-xs);">
                        <span class="special-dates-icon">⏰</span>
                        <span>Available from ${formatSpecialDate(special.startDate)} to ${formatSpecialDate(special.endDate)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Display past specials
    if (pastSpecials.length === 0) {
        pastSpecialsGrid.innerHTML = `
            <div class="specials-empty-state">
                <span class="empty-icon">📜</span>
                <h3>No Past Specials</h3>
                <p>Previous special offers will appear here.</p>
            </div>
        `;
    } else {
        pastSpecialsGrid.innerHTML = pastSpecials.map((special, index) => `
            <div class="special-card" style="animation-delay: ${index * 0.1}s; opacity: 0.85;">
                <span class="special-badge" style="background: linear-gradient(135deg, #95a5a6, #7f8c8d);">Expired</span>
                <div class="special-image-container">
                    <img src="${special.imageUrl}" alt="${special.title}" class="special-image" style="filter: grayscale(30%);">
                </div>
                <div class="special-content">
                    <h3 class="special-title">${special.title}</h3>
                    ${special.description ? `<p class="special-description">${special.description}</p>` : ''}
                    <div class="special-dates">
                        <span class="special-dates-icon">📅</span>
                        <span>Ran from ${formatSpecialDate(special.startDate)} to ${formatSpecialDate(special.endDate)}</span>
                    </div>
                    <div style="padding: 0.75rem; background: var(--color-light); border-radius: var(--radius-sm); text-align: center; color: var(--color-gray); font-size: 0.875rem; font-weight: 600;">
                        This offer has ended
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function formatSpecialDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
    loadSpecials();
    
    // Handle tab clicks
    const tabs = document.querySelectorAll('.specials-tab');
    const tabContents = document.querySelectorAll('.specials-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            if (targetTab === 'current') {
                document.getElementById('currentSpecials').classList.add('active');
            } else if (targetTab === 'upcoming') {
                document.getElementById('upcomingSpecials').classList.add('active');
            } else if (targetTab === 'past') {
                document.getElementById('pastSpecials').classList.add('active');
            }
        });
    });
});

// ==================== Category Modal ====================
const categoryModal = document.getElementById('categoryModal');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalGallery = document.getElementById('modalGallery');

// Category data
const categoryData = {
    cakes: {
        icon: '🎂',
        title: 'Custom Cakes',
        description: 'Exquisite custom cakes for every celebration. From elegant wedding cakes to whimsical birthday creations, each masterpiece is uniquely designed and crafted to make your special moments unforgettable.',
        folder: 'cakes'
    },
    cupcakes: {
        icon: '🧁',
        title: 'Gourmet Cupcakes',
        description: 'Delightful cupcakes in a variety of flavors, beautifully decorated and perfect for any occasion or sweet indulgence. Each cupcake is a miniature work of art, combining exquisite taste with stunning presentation.',
        folder: 'cupcakes'
    },
    cakesicles: {
        icon: '🍰',
        title: 'Cakesicles',
        description: 'Trendy cake pops on a stick, dipped in premium chocolate and decorated with artistic flair. Perfect for parties and gifts. A fun and delicious treat that combines the best of cake and candy.',
        folder: 'cakesicles'
    },
    treatboxes: {
        icon: '🎁',
        title: 'Treat Boxes',
        description: 'Curated assortments of our finest baked goods, beautifully packaged for gifts, corporate events, and celebrations. Each box is thoughtfully arranged with a variety of delicious treats that delight and impress.',
        folder: 'treat boxes'
    },
    cookies: {
        icon: '🍪',
        title: 'Handcrafted Cookies',
        description: 'Classic and creative cookies baked to perfection. From chocolate chip to decorated sugar cookies, made with love. Perfect for any occasion or just because you deserve something sweet and delicious.',
        folder: 'cookies'
    },
    desserts: {
        icon: '🍮',
        title: 'Decadent Desserts',
        description: 'Indulgent desserts and sweet treats that delight the senses. Perfect for special occasions or everyday indulgence. From creamy puddings to elegant tarts, each dessert is a celebration of flavor.',
        folder: 'desserts'
    },
    biscotti: {
        icon: '☕',
        title: 'Artisan Biscotti',
        description: 'Traditional Italian twice-baked biscotti, crisp and flavorful. Perfect for dunking in your favorite coffee or tea. Made with premium ingredients and traditional techniques for authentic taste.',
        folder: 'biscotti'
    },
    meals: {
        icon: '🍽️',
        title: 'Homestyle Meals',
        description: 'Delicious homemade meals prepared with care. From comfort food to gourmet dishes, bringing warmth to your table. Made with fresh ingredients and traditional cooking methods that remind you of home.',
        folder: 'meals'
    },
    bento: {
        icon: '🍱',
        title: 'Bento Cakes',
        description: 'Adorable mini cakes perfect for one or two. Beautifully decorated and ideal for intimate celebrations or personal treats. These charming individual cakes are as delicious as they are cute.',
        folder: 'bento'
    },
    smash: {
        icon: '🎉',
        title: 'Smash Cakes',
        description: 'Fun and photogenic cakes designed for baby\'s first birthday smash sessions. Safe, delicious, and picture-perfect. Watch the joy as little ones dive into these specially crafted celebration cakes.',
        folder: 'smash'
    },
    occasions: {
        icon: '🎊',
        title: 'Special Occasions',
        description: 'Themed creations for weddings, anniversaries, graduations, and milestone celebrations. Making your moments memorable with custom designs that perfectly capture the spirit of your special day.',
        folder: 'occasions'
    },
    treats: {
        icon: '🍬',
        title: 'Sweet Treats',
        description: 'An assortment of delightful confections and sweet surprises. Perfect for gifting or satisfying your sweet tooth. From chocolate-covered delights to colorful candies, pure happiness in every bite.',
        folder: 'treats'
    }
};

// Helper function to get all images from a folder
async function getImagesFromFolder(folderName) {
    const images = [];
    const basePath = `images/${folderName}/`;
    
    // Common image extensions
    const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    
    // Try to load images - this will work if images exist
    // In a real scenario, you'd need a backend API or file listing
    // For now, we'll use a fetch approach to check if files exist
    
    try {
        const response = await fetch(basePath);
        if (response.ok) {
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const links = doc.querySelectorAll('a');
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && extensions.some(ext => href.toLowerCase().endsWith(`.${ext}`))) {
                    images.push({
                        url: basePath + href,
                        name: href.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').replace(/_/g, ' ')
                    });
                }
            });
        }
    } catch (error) {
        console.log(`Could not auto-load images from ${folderName}`);
    }
    
    return images;
}

// Manually define images for each category (since we can't auto-discover in browser)
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

// Open category modal
function openCategoryModal(category) {
    const data = categoryData[category];
    
    if (!data) return;
    
    // Update modal content
    modalIcon.textContent = data.icon;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    
    // Load gallery images for this category
    loadCategoryGallery(category);
    
    // Show modal
    categoryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close category modal
function closeCategoryModal() {
    categoryModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Load gallery images for category
function loadCategoryGallery(category) {
    const data = categoryData[category];
    if (!data) return;
    
    const folderName = data.folder;
    const folderImages = categoryImages[category] || [];
    
    // First try to load from localStorage (uploaded images)
    const storedImages = localStorage.getItem('bakeryGallery');
    const uploadedImages = storedImages ? JSON.parse(storedImages) : [];
    const categoryUploadedImages = uploadedImages.filter(img => img.category === category);
    
    // Combine folder images and uploaded images
    const allImages = [];
    
    // Add images from folder
    folderImages.forEach(filename => {
        allImages.push({
            imageUrl: `images/${folderName}/${filename}`,
            description: filename.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            isFromFolder: true
        });
    });
    
    // Add uploaded images
    categoryUploadedImages.forEach(img => {
        allImages.push({
            imageUrl: img.imageUrl,
            description: img.description,
            isFromFolder: false
        });
    });
    
    if (allImages.length === 0) {
        modalGallery.innerHTML = `
            <div class="category-modal-empty">
                <span class="empty-icon">🎨</span>
                <p>No images available yet for this category</p>
                <small>Check back soon for beautiful creations!</small>
            </div>
        `;
        return;
    }
    
    // Display images
    modalGallery.innerHTML = allImages.map((img, index) => `
        <div class="category-modal-gallery-item" style="animation: fadeInUp 0.5s ease-out ${index * 0.1}s both;" onclick="openLightbox(${index})">
            <img src="${img.imageUrl}" alt="${img.description}" onerror="this.parentElement.style.display='none'">
        </div>
    `).join('');
    
    // Store current images for lightbox
    window.currentLightboxImages = allImages;
}

// ==================== Image Lightbox ====================
const imageLightbox = document.getElementById('imageLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCounter = document.getElementById('lightboxCounter');
let currentImageIndex = 0;

function openLightbox(index) {
    if (!window.currentLightboxImages || window.currentLightboxImages.length === 0) return;
    
    currentImageIndex = index;
    updateLightboxImage();
    imageLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    imageLightbox.classList.remove('active');
    // Don't restore body overflow - keep category modal open
    // The category modal already has body overflow hidden
}

function updateLightboxImage() {
    if (!window.currentLightboxImages) return;
    
    const img = window.currentLightboxImages[currentImageIndex];
    lightboxImage.src = img.imageUrl;
    lightboxImage.alt = img.description || '';
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${window.currentLightboxImages.length}`;
}

function nextImage() {
    if (!window.currentLightboxImages) return;
    currentImageIndex = (currentImageIndex + 1) % window.currentLightboxImages.length;
    updateLightboxImage();
}

function prevImage() {
    if (!window.currentLightboxImages) return;
    currentImageIndex = (currentImageIndex - 1 + window.currentLightboxImages.length) % window.currentLightboxImages.length;
    updateLightboxImage();
}

// Consolidated keyboard navigation
document.addEventListener('keydown', (e) => {
    // Priority 1: Lightbox controls (if lightbox is open)
    if (imageLightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
            return;
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextImage();
            return;
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevImage();
            return;
        }
    }
    
    // Priority 2: Category modal controls (only if lightbox is NOT open)
    if (e.key === 'Escape' && categoryModal.classList.contains('active')) {
        closeCategoryModal();
    }
});

// Prevent modal content click from closing modal
document.querySelector('.category-modal-content')?.addEventListener('click', (e) => {
    e.stopPropagation();
});

// ==================== Console Welcome Message ====================
console.log('%c🍞 Welcome to Anchen\'s Artisan Bakery! 🎂', 'font-size: 16px; font-weight: bold; color: #d4a574;');
console.log('%cMade with love and JavaScript ❤️', 'font-size: 12px; color: #6b6b6b;');

// ==================== Phone Number Validation ====================
/**
 * Validates and formats South African phone numbers
 * @param {string} phoneNumber - The phone number to validate
 * @returns {object} - { isValid: boolean, formattedNumber: string, error: string }
 */
function validatePhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Remove leading zero if present (common in South African numbers)
    if (cleanNumber.startsWith('0')) {
        cleanNumber = cleanNumber.substring(1);
    }
    
    // Check if number is empty
    if (cleanNumber.length === 0) {
        return {
            isValid: false,
            formattedNumber: '',
            error: 'Phone number is required'
        };
    }
    
    // South African numbers should be 9 digits after removing leading 0
    if (cleanNumber.length !== 9) {
        return {
            isValid: false,
            formattedNumber: '',
            error: 'Phone number should be 9 digits (without the leading 0)'
        };
    }
    
    // Check if number contains only digits
    if (!/^\d+$/.test(cleanNumber)) {
        return {
            isValid: false,
            formattedNumber: '',
            error: 'Phone number should contain only digits'
        };
    }
    
    // Format the complete number with +27 country code
    const formattedNumber = `+27${cleanNumber}`;
    
    return {
        isValid: true,
        formattedNumber: formattedNumber,
        error: ''
    };
}

/**
 * Add real-time validation feedback to phone input
 */
function setupPhoneValidation(phoneInputId, formGroupSelector) {
    const phoneInput = document.getElementById(phoneInputId);
    
    if (!phoneInput) return;
    
    const formGroup = phoneInput.closest(formGroupSelector);
    
    // Remove any existing error messages
    const removeErrorMessage = () => {
        const existingError = formGroup.querySelector('.phone-error');
        if (existingError) {
            existingError.remove();
        }
    };
    
    // Show error message
    const showErrorMessage = (message) => {
        removeErrorMessage();
        const errorElement = document.createElement('small');
        errorElement.className = 'phone-error';
        errorElement.textContent = message;
        const hint = formGroup.querySelector('.phone-hint');
        if (hint) {
            hint.after(errorElement);
        } else {
            formGroup.appendChild(errorElement);
        }
    };
    
    // Validate on blur (when user leaves the field)
    phoneInput.addEventListener('blur', () => {
        const phoneValue = phoneInput.value.trim();
        
        // Only validate if field has content
        if (phoneValue) {
            const validation = validatePhoneNumber(phoneValue);
            
            if (!validation.isValid) {
                phoneInput.style.borderColor = '#721c24';
                showErrorMessage(validation.error);
            } else {
                phoneInput.style.borderColor = '';
                removeErrorMessage();
            }
        } else {
            phoneInput.style.borderColor = '';
            removeErrorMessage();
        }
    });
    
    // Clear error on input
    phoneInput.addEventListener('input', () => {
        phoneInput.style.borderColor = '';
        removeErrorMessage();
    });
}

// Setup validation for both forms
document.addEventListener('DOMContentLoaded', () => {
    setupPhoneValidation('phone', '.form-group');
    setupPhoneValidation('bookingPhone', '.form-group');
});

// ==================== Booking Modal ====================
const floatingBookingBtn = document.getElementById('floatingBookingBtn');
const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const bookingFormStatus = document.getElementById('bookingFormStatus');
const bookingDateInput = document.getElementById('bookingDate');

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
bookingDateInput.setAttribute('min', today);

// Open booking modal
function openBookingModal() {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close booking modal
function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners for opening modal
floatingBookingBtn.addEventListener('click', openBookingModal);

// Close modal when clicking overlay
document.querySelector('.booking-modal-overlay')?.addEventListener('click', closeBookingModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
        // Only close booking modal if it's the topmost modal
        if (!imageLightbox.classList.contains('active') && !categoryModal.classList.contains('active')) {
            closeBookingModal();
        }
    }
});

// Prevent modal content click from closing modal
document.querySelector('.booking-modal-content')?.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Handle booking form submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get phone input
    const phoneInput = document.getElementById('bookingPhone');
    const phoneValue = phoneInput.value.trim();
    
    // Validate phone number (required for booking form)
    const phoneValidation = validatePhoneNumber(phoneValue);
    if (!phoneValidation.isValid) {
        // Show error and prevent submission
        phoneInput.style.borderColor = '#721c24';
        const formGroup = phoneInput.closest('.form-group');
        const existingError = formGroup.querySelector('.phone-error');
        if (existingError) existingError.remove();
        
        const errorElement = document.createElement('small');
        errorElement.className = 'phone-error';
        errorElement.textContent = phoneValidation.error;
        const hint = formGroup.querySelector('.phone-hint');
        if (hint) {
            hint.after(errorElement);
        } else {
            formGroup.appendChild(errorElement);
        }
        
        // Scroll to the error
        phoneInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    // Get form data
    const formData = {
        name: document.getElementById('bookingName').value,
        phone: phoneValidation.formattedNumber,
        email: document.getElementById('bookingEmail').value,
        date: document.getElementById('bookingDate').value,
        description: document.getElementById('bookingDescription').value
    };
    
    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < todayDate) {
        bookingFormStatus.className = 'form-status error';
        bookingFormStatus.textContent = 'Please select a date that is today or in the future.';
        setTimeout(() => {
            bookingFormStatus.style.display = 'none';
        }, 5000);
        return;
    }
    
    // Show loading state
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual backend endpoint)
    try {
        // In a real application, you would send this to a backend API
        // Example: await fetch('/api/booking', { method: 'POST', body: JSON.stringify(formData) })
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        
        // Log booking data (for demonstration)
        console.log('Booking Request:', formData);
        
        // Reset form
        bookingForm.reset();
        
        // Reset min date for next use
        bookingDateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
        
        // Close booking modal
        closeBookingModal();
        
        // Show thank you modal with countdown
        showThankYouModal();
        
    } catch (error) {
        // Show error message
        bookingFormStatus.className = 'form-status error';
        bookingFormStatus.textContent = 'Oops! Something went wrong. Please try again or contact us directly.';
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            bookingFormStatus.style.display = 'none';
        }, 5000);
    } finally {
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// ==================== Initialize on Page Load ====================
// Load specials from localStorage when page loads
loadSpecials();
