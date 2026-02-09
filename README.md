# Anchen's Artisan Bakery - Image Upload System

## 📸 Admin Panel Guide

### Accessing the Admin Panel
Open `admin.html` in your browser to access the image upload and management system.

### Features

#### 1. **Upload Images**
- Click or drag-and-drop images to upload
- Select a category from the dropdown:
  - Custom Cakes
  - Gourmet Cupcakes
  - Cakesicles
  - Treat Boxes
  - Artisan Biscotti
  - Handcrafted Cookies
  - Homestyle Meals
- Add a description (will be automatically beautified)
- Click "Upload to Gallery" to save

#### 2. **Manage Gallery**
- View all uploaded images
- Filter by category
- See upload statistics
- Delete images you no longer need

#### 3. **Description Beautification**
The system automatically:
- Capitalizes the first letter
- Adds proper punctuation
- Formats sentences correctly
- Removes extra spaces

### How It Works

#### Storage
- Images are stored in your browser's **localStorage**
- Images are converted to base64 format
- No server or database required
- Data persists across browser sessions

#### Main Website Integration
- The main website (`index.html`) automatically loads images from localStorage
- Gallery updates in real-time when you upload new images
- Category filters work on both admin and main pages

### Tips for Best Results

1. **Image Quality**
   - Use high-resolution images (at least 1000x1000px)
   - Ensure good lighting
   - Square images (1:1 ratio) display best

2. **File Size**
   - Maximum 5MB per image
   - Compress large images before uploading
   - Use JPG for photos, PNG for graphics

3. **Descriptions**
   - Keep descriptions concise (2-3 sentences)
   - Highlight what makes the creation special
   - Mention flavors, occasions, or unique features

4. **Categories**
   - Choose the most appropriate category
   - Consistent categorization helps customers browse
   - Use "Treat Boxes" for assortments

### Browser Compatibility

The system works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Note:** localStorage is browser-specific. Images uploaded in Chrome won't appear in Firefox unless you export/import the data.

### Storage Limits

- localStorage typically allows 5-10MB total
- Monitor your storage usage
- Delete old images to free up space
- Approximately 20-50 images depending on file sizes

### Troubleshooting

**Images not appearing on main website?**
- Refresh the page
- Check browser console for errors
- Ensure you're viewing the same browser where you uploaded

**Upload fails?**
- Check image file size (must be under 5MB)
- Ensure image format is JPG, PNG, or WebP
- Try a different image

**Storage full?**
- Delete unused images from the admin panel
- Clear browser cache (will delete all images)
- Compress images before uploading

### Data Backup

To backup your gallery:
1. Open browser console (F12)
2. Type: `localStorage.getItem('bakeryGallery')`
3. Copy the output and save to a text file
4. To restore, use: `localStorage.setItem('bakeryGallery', 'PASTE_DATA_HERE')`

---

## 🎨 Main Website Features

### Gallery Display
- Automatic loading from uploaded images
- Category filtering
- Smooth animations
- Responsive design
- Hover effects with descriptions

### Contact Form
- Thank you modal with 10-second countdown
- Automatic redirect to homepage
- Beautiful animations
- Mobile-friendly

---

## 📁 File Structure

```
MadBatter/
├── index.html              # Main website
├── admin.html              # Admin panel for uploads
├── styles.css              # Main website styles
├── admin-styles.css        # Admin panel styles
├── script.js               # Main website functionality
├── admin-script.js         # Admin panel functionality
└── README.md              # This file
```

---

## 🚀 Quick Start

1. Open `admin.html` in your browser
2. Upload your first image with a description
3. Select the appropriate category
4. Click "Upload to Gallery"
5. View your image on the main website (`index.html`)

Enjoy showcasing your beautiful creations! 🎂✨
