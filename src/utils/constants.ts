export const STORAGE_KEYS = {
  GALLERY_IMAGES: 'bakeryGallery',
  SPECIALS: 'bakerySpecials',
  USERS: 'bakeryUsers',
  BOOKING_REQUESTS: 'bakeryBookingRequests',
} as const;

export const CATEGORIES = [
  { id: 'cakes', name: 'Cakes', icon: '🎂' },
  { id: 'cupcakes', name: 'Cupcakes', icon: '🧁' },
  { id: 'cakesicles', name: 'Cakesicles', icon: '🍭' },
  { id: 'treatboxes', name: 'Treat Boxes', icon: '🎁' },
  { id: 'cookies', name: 'Cookies', icon: '🍪' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'biscotti', name: 'Biscotti', icon: '🥖' },
  { id: 'meals', name: 'Meals', icon: '🍽️' },
  { id: 'bento', name: 'Bento Cakes', icon: '🍱' },
  { id: 'smash', name: 'Smash Cakes', icon: '🔨' },
  { id: 'occasions', name: 'Special Occasions', icon: '🎉' },
  { id: 'treats', name: 'Treats', icon: '🍬' },
] as const;
