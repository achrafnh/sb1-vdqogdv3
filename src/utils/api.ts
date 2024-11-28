import axios from './axios';
import type { SearchFilters, Lawyer } from '@/types';

export async function fetchLawyers(filters: SearchFilters): Promise<Lawyer[]> {
  const params = new URLSearchParams();
  if (filters.expertise) params.append('expertise', filters.expertise);
  if (filters.location) params.append('location', filters.location);
  if (filters.rating) params.append('rating', filters.rating.toString());

  const response = await axios.get(`/api/lawyers?${params.toString()}`);
  return response.data;
}

export async function fetchLawyerById(id: number): Promise<Lawyer> {
  const response = await axios.get(`/api/lawyers/${id}`);
  return response.data;
}