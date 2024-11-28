import { createI18n } from 'vue-i18n';
import en from './locales/en';
import fr from './locales/fr';
import ar from './locales/ar';
import es from './locales/es';

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    ar,
    es
  }
});

export const availableLocales = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'es', name: 'Español' }
];