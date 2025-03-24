<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import LayoutComponent from '@/components/layoutComponent.vue';

const router = useRouter();
const authStore = useAuthStore();
const isAuthenticated = computed(() => !!authStore.token);

// Redirigir al login si el usuario no está autenticado
watch(isAuthenticated, (newValue) => {
  if (!newValue) {
    router.push({ name: 'login' });
  }
});
</script>

<template>
         <LayoutComponent/>

</template>
