// Image Scanner Script - Run this in Node.js to generate the categoryImages object
// This script scans the images folder and creates a JavaScript object with all image filenames

const fs = require('fs');
const path = require('path');

const imagesDir = './images';
const folders = [
    'cakes', 'cupcakes', 'cakesicles', 'treat boxes', 'cookies',
    'desserts', 'biscotti', 'meals', 'bento', 'smash', 'occasions', 'treats'
];

const categoryImages = {};

folders.forEach(folder => {
    const folderPath = path.join(imagesDir, folder);
    
    try {
        if (fs.existsSync(folderPath)) {
            const files = fs.readdirSync(folderPath);
            const imageFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
            });
            
            // Use folder name without spaces for key
            const key = folder.replace(' ', '');
            categoryImages[key] = imageFiles;
            
            console.log(`${folder}: ${imageFiles.length} images`);
        }
    } catch (error) {
        console.error(`Error reading folder ${folder}:`, error.message);
    }
});

console.log('\n// Copy this into script.js:\n');
console.log('const categoryImages = ' + JSON.stringify(categoryImages, null, 4) + ';');
