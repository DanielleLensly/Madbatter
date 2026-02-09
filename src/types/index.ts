// Type definitions for The Mad Batter application

export interface GalleryImage {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  fileName: string;
  uploadDate: string;
}

export interface Special {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  fileName: string;
  createdDate: string;
}

export interface User {
  username: string;
  email?: string;
  password: string;
  role: 'admin' | 'user';
  securityQuestion: string;
  securityAnswer: string;
  createdDate: string;
}

export interface ContactFormData {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email?: string;
  date: string;
  description: string;
}

export type CategoryType =
  | 'cakes'
  | 'cupcakes'
  | 'cakesicles'
  | 'treatboxes'
  | 'cookies'
  | 'desserts'
  | 'biscotti'
  | 'meals'
  | 'bento'
  | 'smash'
  | 'occasions'
  | 'treats';

export interface ServiceCategory {
  id: CategoryType;
  name: string;
  icon: string;
  description: string;
  images?: string[];
}
