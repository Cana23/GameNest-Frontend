<template>
  <section>
    <div class='container'>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por título..."
        class="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <div v-if="loading">Cargando publicaciones...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else class='content' v-for="publication in filteredPublications" :key="publication.id">
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
              <i
                :class="['pi', publication.hasLiked ? 'pi-heart-fill' : 'pi-heart', 'text-violet-500', 'cursor-pointer']"
                @click="toggleLike(publication)">
              </i>
              <p class="text-gray-600 text-sm">{{ publication.likes || 0 }} me gusta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { usePublicationsStore } from '@/stores/publicationtsStore';

const publicationsStore = usePublicationsStore();
const { loading, error } = publicationsStore;
const searchQuery = ref('');

onMounted(() => {
  publicationsStore.fetchPublications();
});

const filteredPublications = computed(() => {
  return publicationsStore.publications.filter(publication =>
    publication.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const toggleLike = (publication: any) => {
  publication.hasLiked = !publication.hasLiked;
  if (publication.hasLiked) {
    publication.likes = (publication.likes || 0) + 1;
  } else {
    publication.likes = Math.max((publication.likes || 1) - 1, 0);
  }
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
.img-publication {
  object-fit: cover;
  width: 100%;
  max-height: 300px;
  border-radius: 5px;
}
</style>
