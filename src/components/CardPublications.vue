<template>
  <section>
    <div class='container'>
      <div v-if="loading">Cargando publicaciones...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else class='content' v-for="publication in publicationsStore.publications" :key="publication.id">
        <div class="flex gap-4 items-center">
          <img src="../assets/images/gojo cat.jpg" alt="" class="img-profile">
          <div class="flex flex-col">
            <p class="text-gray-600">{{ publication.userName }}</p>
            <p class="text-gray-600 text-sm">{{ formatDate(publication.publicationDate) }}</p>
          </div>
        </div>
        <div class="w-full px-6 flex flex-col gap-4">
          <p class="text-gray-600 font-semibold">{{ publication.title }}</p>
          <p class="text-gray-600">{{ publication.content }}</p>
          <img v-if="publication.imageUrl" :src="publication.imageUrl" alt="" class="img-publication">
          <img src="https://images.app.goo.gl/h34haR1gbzV7VBuP8" alt="">
          <div class="flex gap-5 justify-end">
            <div class="flex gap-2">
              <i class="pi pi-heart text-violet-500 cursor-pointer"></i>
              <p class="text-gray-600 text-sm">10 me gusta</p>
            </div>
            <div class="flex gap-2">
              <i class="pi pi-comments text-violet-500 cursor-pointer"></i>
              <p class="text-gray-600 text-sm">10 comentarios</p>
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
