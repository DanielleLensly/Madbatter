import { GalleryImage } from '../types';

// Helper to create a title from filename
const titleFromFilename = (filename: string): string => {
  return filename
    .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Base path for images - uses correct path based on environment
const getBasePath = () => {
  return import.meta.env.PROD ? '/Madbatter' : '';
};

// Create gallery items from folder structure
const createGalleryItems = (): GalleryImage[] => {
  const basePath = getBasePath();
  const items: GalleryImage[] = [];
  let id = 1000;

  // Cakes
  const cakes = [
    'baby-cake.jpg', 'baley-cake.jpg', 'black-panther-cake.jpg', 'blue-cake.jpg',
    'blue-glitter-cake.jpg', 'buttercream-cake.jpg', 'car-cake.jpg', 'cricket-cake.jpg',
    'death-by-chocolate-cake.jpg', 'denim-cake.jpg', 'dnd-cake.jpg', 'flower-cake.jpg',
    'frozen-cake.jpg', 'hello-kitty-cake.jpg', 'mermaid-cake.jpg', 'mom-birthday-cake.jpg',
    'pink-flower-cake.jpg', 'shiny-pink-cake.jpg', 'strawberry-cake.jpg', 'white-gold-sparkle-cake.jpg'
  ];
  cakes.forEach(file => {
    items.push({
      id: String(id++),
      category: 'cakes',
      title: titleFromFilename(file),
      description: '',
      imageUrl: `${basePath}/images/cakes/${file}`,
      fileName: file,
      uploadDate: new Date().toISOString()
    });
  });

  // Cupcakes
  const cupcakes = [
    'blue-green-white-purple-cupcakes.jpg', 'butterfly-cupcakes.jpg', 'cancer-awareness-cupcakes.jpg',
    'cupcake-box.jpg', 'denim-cupcakes.jpg', 'elsa-cupcakes.jpg', 'flower-cupcakes.jpg',
    'green-pink-cupcakes.jpg', 'green-white-blue-pink-cupcakes.jpg', 'mermaid-cupcakes.jpg',
    'soft-colour-cupcakes.jpg', 'succulent-cupcakes.jpg', 'tools-cupcakes.jpg'
  ];
  cupcakes.forEach(file => {
    items.push({
      id: String(id++),
      category: 'cupcakes',
      title: titleFromFilename(file),
      description: '',
      imageUrl: `${basePath}/images/cupcakes/${file}`,
      fileName: file,
      uploadDate: new Date().toISOString()
    });
  });

  // Cakesicles
  const cakesicles = [
    'cakesicle-treats.jpg', 'cricket-cakesicles.jpg', 'dc-cakesicles.jpg',
    'dinosaur-cakesicles.jpg', 'halloween-cakesicles.jpg', 'harry-potter-cakesicles.jpg',
    'pink-cakesicles.jpg'
  ];
  cakesicles.forEach(file => {
    items.push({
      id: String(id++),
      category: 'cakesicles',
      title: titleFromFilename(file),
      description: '',
      imageUrl: `${basePath}/images/cakesicles/${file}`,
      fileName: file,
      uploadDate: new Date().toISOString()
    });
  });

  // Cookies
  const cookies = [
    'batman-cookies.jpg', 'choco-oreo-cookies.jpg', 'cinnamon-roll-cookies.jpg',
    'easter-cookies.jpg', 'halloween-cookies-1.jpg', 'halloween-cookies.jpg',
    'heart-cookies.jpg', 'xmas-cookies.jpg'
  ];
  cookies.forEach(file => {
    items.push({
      id: String(id++),
      category: 'cookies',
      title: titleFromFilename(file),
      description: '',
      imageUrl: `${basePath}/images/cookies/${file}`,
      fileName: file,
      uploadDate: new Date().toISOString()
    });
  });

  // Bento Cakes
  const bento = ['bento-blue.jpg', 'bento-pink.jpg'];
  bento.forEach(file => {
    items.push({
      id: String(id++),
      category: 'bento',
      title: titleFromFilename(file),
      description: '',
      imageUrl: `${basePath}/images/bento/${file}`,
      fileName: file,
      uploadDate: new Date().toISOString()
    });
  });

  // Treat Boxes
  const treatboxes = [
    '16-treat-box.jpg', 'denim-treats.jpg', 'mix-cookies-box.jpg',
    'pokemon-treats-1.jpg', 'star-wars-treats.jpg', 'treats-1.jpg',
    'treats-2.jpg', 'treats-3.jpg', 'tyler-treat-box.jpg'
  ];
  treatboxes.forEach(file => {
    items.push({
      id: String(id++),
      category: 'treatboxes',
      title: titleFromFilename(file),
      description: '',
      imageUrl: `${basePath}/images/treat boxes/${file}`,
      fileName: file,
      uploadDate: new Date().toISOString()
    });
  });

  // Desserts
  const desserts = [
    'dessert-1.jpg', 'dessert-2.jpg', 'dessert-3.jpg', 'dessert-4.jpg',
    'dessert-5.jpg', 'dessert-6.jpg', 'dessert.jpg'
  ];
  desserts.forEach(file => {
    items.push({
      id: String(id++),
      category: 'desserts',
      title: titleFromFilename(file),
      description: '',
      imageUrl: `${basePath}/images/desserts/${file}`,
      fileName: file,
      uploadDate: new Date().toISOString()
    });
  });

  // Treats
  const treats = [
    'grogu-choc-bomb.jpg', 'hazelnut-fudge-treats.jpg', 'marshmallow-fudge.jpg',
    'peppermint-crisp-treats.jpg', 'treats-table-1.jpg', 'treats-table.jpg',
    'turkish-delight-treats.jpg', 'unicorn-choco-bomb.jpg'
  ];
  treats.forEach(file => {
    items.push({
      id: String(id++),
      category: 'treats',
      title: titleFromFilename(file),
      description: '',
      imageUrl: `${basePath}/images/treats/${file}`,
      fileName: file,
      uploadDate: new Date().toISOString()
    });
  });

  // Biscotti
  const biscotti = ['admond-cranberry-biscotti.jpg'];
  biscotti.forEach(file => {
    items.push({
      id: String(id++),
      category: 'biscotti',
      title: titleFromFilename(file),
      description: '',
      imageUrl: `${basePath}/images/biscotti/${file}`,
      fileName: file,
      uploadDate: new Date().toISOString()
    });
  });

  return items;
};

export const defaultGalleryImages = createGalleryItems();
