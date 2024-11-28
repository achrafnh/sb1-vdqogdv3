export interface SearchFilters {
  expertise?: string;
  location?: string;
  rating?: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Lawyer {
  id: number;
  userId: number;
  name: string;
  email: string;
  expertise: string[];
  location: string;
  bio: string;
  rating: number;
  yearsOfExperience: number;
  profileImage?: string;
}