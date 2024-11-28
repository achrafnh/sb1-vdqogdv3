import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';
import { useRouter } from 'vue-router';
import axios from '@/utils/axios';
import { validateEmail, validatePassword, validateName, validateRole } from '@/utils/validation';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const isAuthenticated = computed(() => !!token.value);

  async function login(email: string, password: string) {
    try {
      loading.value = true;
      error.value = null;

      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      const response = await axios.post('/api/auth/login', { email, password });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('auth_token', response.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      error.value = message;
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  }

  async function signup(userData: Partial<User> & { password: string }) {
    try {
      loading.value = true;
      error.value = null;

      if (!validateEmail(userData.email!)) {
        throw new Error('Invalid email format');
      }

      if (!validatePassword(userData.password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (!validateName(userData.name!)) {
        throw new Error('Name must be at least 2 characters long');
      }

      if (!validateRole(userData.role!)) {
        throw new Error('Invalid role selected');
      }

      const response = await axios.post('/api/auth/signup', userData);
      router.push('/login');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Signup failed';
      error.value = message;
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
    router.push('/login');
  }

  // Initialize auth state from localStorage
  async function init() {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      token.value = savedToken;
      try {
        const response = await axios.get('/api/auth/profile');
        user.value = response.data;
      } catch (err) {
        logout(); // Token is invalid or expired
      }
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    init
  };
});