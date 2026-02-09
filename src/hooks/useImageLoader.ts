import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GalleryImage } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { IMAGE_MANIFEST } from '../utils/imageManifest';

/**
 * ImageLoader Hook
 * Automatically loads images from public/images folder into localStorage
 * Uses the auto-generated IMAGE_MANIFEST
 * Only runs once on first app load
 */
export const useImageLoader = () => {
  const [galleryImages, setGalleryImages] = useLocalStorage<GalleryImage[]>(
    STORAGE_KEYS.GALLERY_IMAGES,
    []
  );

  useEffect(() => {
    // Only load if gallery is empty
    if (galleryImages.length === 0) {
      console.log('🖼️ Loading images from manifest...');
      const images: GalleryImage[] = [];

      Object.entries(IMAGE_MANIFEST).forEach(([category, files]) => {
        files.forEach((fileName, index) => {
          // Create a title from the filename
          const title = fileName
            .replace(/\.(jpg|jpeg|png|webp)$/i, '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          images.push({
            id: `${category}-${index}-${Date.now()}`,
            category,
            title,
            description: `Beautiful ${title.toLowerCase()}`,
            imageUrl: `/images/${category}/${fileName}`,
            fileName,
            uploadDate: new Date().toISOString(),
          });
        });
      });

      setGalleryImages(images);
      console.log(`✅ Loaded ${images.length} images from ${Object.keys(IMAGE_MANIFEST).length} categories`);
    }
  }, []); // Only run once on mount

  return galleryImages;
};
