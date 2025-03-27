<template>
  <div class="bg-white rounded-lg shadow-md p-4" v-for="post in publications" :key="post.id">
    <!-- Usuario -->
    <div class="flex items-center space-x-2 mb-2">
      <img :src="'https://ui-avatars.com/api/?name=' + (post.userName || 'Usuario desconocido')" alt="Avatar" class="w-10 h-10 rounded-full" />
      <p class="font-semibold text-gray-700">{{ post.userName || 'Usuario desconocido' }}</p>
    </div>

    <!-- Imagen -->
    <div v-if="post.imageUrl" class="mb-4">
      <img :src="post.imageUrl" alt="Imagen de la publicación" class="w-full rounded-lg" />
    </div>

    <!-- Título -->
    <h3 class="text-lg font-bold text-gray-900 mb-1">{{ post.title }}</h3>

    <!-- Contenido -->
    <p class="text-gray-700 mb-4">{{ post.content }}</p>

    <!-- Fecha de publicación -->
    <p class="text-sm text-gray-500 mb-4">Publicado el: {{ new Date(post.publicationDate).toLocaleString() }}</p>

    <!-- Like -->
    <div class="flex items-center mb-4">
      <button class="text-blue-500 hover:text-blue-700 font-semibold" @click="toggleLike(post)">
        ❤️ Me gusta ({{ post.totalLikes }})
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { usePublicationsStore } from '@/stores/publicationtsStore';
import LikeService from '@/services/LikeService';

const publicationsStore = usePublicationsStore();
const { loading, error } = publicationsStore;

// Cargar publicaciones al montar el componente
onMounted(() => {
  publicationsStore.fetchPublications();
});

// Alternar likes
const toggleLike = async (publication: any) => {
  try {
    if (publication.hasLiked) {
      // Eliminar like
      await LikeService.removeLike(publication.id);
      publication.totalLikes -= 1;
    } else {
      // Agregar like
      await LikeService.addLike(publication.id);
      publication.totalLikes += 1;
    }
    publication.hasLiked = !publication.hasLiked; // Alternar el estado de "Me gusta"
  } catch (error) {
    console.error('Error al alternar el like:', error);
  }
};
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
