<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import layoutComponent from '@/components/layoutComponent.vue';
import Publications from './Publications.vue';
import BannerCarousel from '@/components/BannerCarousel.vue';

const router = useRouter();
const authStore = useAuthStore();
const isAuthenticated = computed(() => !!authStore.token);

watch(isAuthenticated, (newValue) => {
  if (!newValue) {
    router.push({ name: 'login' });
  }
});
</script>

<template>
  <layoutComponent/>
  <div class="main-content">
    <BannerCarousel class="banner-wrapper"/>
    <div class="content-center max-w-6xl mx-auto px-4">
      <Publications/>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  padding: 1rem;
  transition: margin-left 0.3s;
}

/* Cuando el sidebar está colapsado */
.aside-collapsed + .main-content {
  margin-left: 5rem;
}
.banner-wrapper {
  margin-left: 16rem;
  width: calc(100% - 16rem);
  transition: all 0.3s;
}

.aside-collapsed .banner-wrapper {
  margin-left: 5rem;
  width: calc(100% - 5rem);
}

.content-center {
  width: calc(100% - 2rem);
}
</style>
