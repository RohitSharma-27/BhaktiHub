export type ArtistCategory = 'singer' | 'musician' | 'decorator' | 'sound';

export interface Artist {
  id: string;
  name: string;
  category: ArtistCategory;
  subcategory: string;
  city: string;
  state: string;
  rating: number;
  instruments?: string[];
  speakerBoxes?: string[];
  experience_years: number;
  languages?: string[];
  price_from: number;
  bio: string;
  short_bio: string;
  image_url: string;
 
  
  specialties: string[];
  events_done: number;
  verified: boolean;
  available: boolean;
  created_at?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  image_url: string;
  category: string;
  organizer: string;
  price_range: string;
  featured: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  text: string;
  avatar_url: string;
}

export interface Booking {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  artist_id: string;
  artist_name: string;
  artist_image: string;
  event_date: string;
  event_type: string;
  event_city: string;
  event_address: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  artist_id: string;
  artist: Artist;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface ArtistFilters {
  search: string;
  city: string;
  category: ArtistCategory | 'all';
  minRating: number;
  sortBy: 'rating' | 'price-low' | 'price-high' | 'experience';
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
