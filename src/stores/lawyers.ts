import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Lawyer, SearchFilters } from '@/types';
import axios from '@/utils/axios';

export const useLawyersStore = defineStore('lawyers', () => {
  const lawyers = ref<Lawyer[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedLawyer = ref<Lawyer | null>(null);

  async function searchLawyers(filters: SearchFilters) {
    try {
      loading.value = true;
      error.value = null;

      const params = new URLSearchParams();
      if (filters.expertise) params.append('expertise', filters.expertise);
      if (filters.location) params.append('location', filters.location);
      if (filters.rating) params.append('rating', filters.rating.toString());

      const response = await axios.get(`/api/lawyers?${params.toString()}`);
      lawyers.value = response.data;
    } catch (err: any) {
      console.error('Error fetching lawyers:', err.message);
      error.value = 'Failed to fetch lawyers';
      lawyers.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function getLawyerById(id: number) {
    try {
      loading.value = true;
      error.value = null;

      const response = await axios.get(`/api/lawyers/${id}`);
      selectedLawyer.value = response.data;
      return response.data;
    } catch (err: any) {
      console.error('Error fetching lawyer:', err.message);
      error.value = 'Failed to fetch lawyer details';
      selectedLawyer.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  }

  function clearSelectedLawyer() {
    selectedLawyer.value = null;
  }

  return {
    lawyers,
    loading,
    error,
    selectedLawyer,
    searchLawyers,
    getLawyerById,
    clearSelectedLawyer
  };
});