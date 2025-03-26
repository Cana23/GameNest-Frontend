<template>
  <section>
    <div class='container'>
      <div v-if="loading">Cargando publicaciones...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else class='content' v-for="publication in publicationsStore.publications" :key="publication.id">
        <div class="flex gap-4 items-center">
          <router-link :to="{ name: 'Perfil', params: { id: publication.userId } }">
            <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
          </router-link>
            <div class="flex flex-col">
              <router-link :to="{ name: 'Perfil', params: { id: publication.userId } }" class="text-gray-600 hover:text-purple-600">
              {{ publication.userName }}
            </router-link>
            <p class="text-gray-600 text-sm">{{ formatDate(publication.publicationDate) }}</p>
          </div>
        </div>
        <div class="w-full px-6 flex flex-col gap-4">
          <p class="text-gray-600 font-semibold">{{ publication.title }}</p>
          <p class="text-gray-600">{{ publication.content }}</p>
          <img v-if="publication.imageUrl" :src="publication.imageUrl" alt="" class="img-publication">
          <div class="flex gap-5 justify-end">
            <div class="flex gap-2">
              <!-- Cambiar icono y cantidad de likes al hacer clic -->
              <i
                :class="['pi', publication.hasLiked ? 'pi-heart-fill' : 'pi-heart', 'text-violet-500', 'cursor-pointer']"
                @click="publicationsStore.toggleLike(publication)">
              </i>
              <p class="text-gray-600 text-sm" v-if="publication.likes">{{ publication.likes || 0 }} me gusta</p>
              <p class="text-gray-600 text-sm" v-if="!publication.likes">0 me gusta</p>
            </div>
            <div class="flex gap-2">
              <i class="pi pi-comments text-violet-500 cursor-pointer"></i>
              <p class="text-gray-600 text-sm">{{ publication.comments?.length }} comentarios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script lang="ts" setup>
import { onMounted } from 'vue';
import { usePublicationsStore } from '@/stores/publicationtsStore';

const publicationsStore = usePublicationsStore();
const { loading, error } = publicationsStore;

onMounted(() => {
  publicationsStore.fetchPublications();
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Método para alternar "me gusta" y actualizar la publicación
const toggleLike = (publication: any) => {
  if (publication.hasLiked) {
    // Si ya le dio "me gusta", lo elimina
    publication.likes?.pop(); // Elimina el último "like" (esto depende de cómo guardes los "likes")
  } else {
    // Si no le dio "me gusta", lo agrega
    publication.likes?.push({}); // Agregar un "like", puedes agregar más detalles si lo deseas
  }

  // Alternar el estado de hasLiked
  publication.hasLiked = !publication.hasLiked;

  // Aquí puedes guardar los cambios en el servidor si es necesario
  // publicationsStore.savePublication(publication);
};
</script>


<style scoped>
section {
  padding-top: 30px;
  padding-left: 335px;
}
.content {
  width: 100%;
  border: solid 1px rgb(207, 207, 207);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 25px;
}
.img-profile {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
.img-publication {
  object-fit: cover;
  width: 100%;
  max-height: 300px;
  border-radius: 5px;
}
</style>
