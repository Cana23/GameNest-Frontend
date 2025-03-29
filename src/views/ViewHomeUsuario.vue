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
/* Aplica la imagen de fondo a toda la pantalla */
.main-content {
  padding: 1rem;
  transition: margin-left 0.3s;
  min-height: 100vh; /* Que ocupe toda la altura */
  background: url('@/assets/images/Fondo.jpeg') no-repeat center center fixed,
  linear-gradient(to bottom, #a237b3, #6d0a26);  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* Mantiene el fondo fijo */
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
  padding: 1rem;
  border-radius: 10px;
}
</style>
