<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
    >
      <span>{{ currentLocale.name }}</span>
      <ChevronDownIcon class="h-5 w-5" />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
    >
      <div class="py-1" role="menu">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="changeLocale(locale.code)"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          {{ locale.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { availableLocales } from '@/i18n';

const { locale } = useI18n();
const isOpen = ref(false);

const currentLocale = computed(() => {
  return availableLocales.find(l => l.code === locale.value) || availableLocales[0];
});

function changeLocale(code: string) {
  locale.value = code;
  isOpen.value = false;
  document.documentElement.dir = availableLocales.find(l => l.code === code)?.dir || 'ltr';
}
</script>