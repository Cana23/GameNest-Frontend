<template>
  <section>
    <div class="container">
      <!-- Barra de búsqueda añadida -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por título..."
        class="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <div v-if="loading">Cargando publicaciones...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else class="content" v-for="publication in filteredPublications" :key="publication.id">
        <!-- Usuario -->
        <div class="flex gap-4 items-center">
          <router-link :to="{ name: 'Perfil', params: { id: publication.userId } }">
            <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
          </router-link>
          <div class="flex flex-col">
            <router-link :to="{ name: 'Perfil', params: { id: publication.userId } }" class="text-gray-600 hover:text-purple-600">
              {{ publication.userName || 'Usuario desconocido' }}
            </router-link>
            <p class="text-gray-600 text-sm">{{ formatDate(publication.publicationDate) }}</p>
          </div>
        </div>

        <!-- Contenido de la publicación -->
        <div class="w-full px-6 flex flex-col gap-4">
          <p class="text-gray-600 font-semibold">{{ publication.title }}</p>
          <p class="text-gray-600">{{ publication.content }}</p>
          <img v-if="publication.imageUrl" :src="publication.imageUrl" alt="" class="img-publication">

          <!-- Likes y comentarios -->
          <div class="flex gap-5 justify-end">
            <!-- Likes -->
            <div class="flex gap-2">
              <i
                :class="['pi', publication.hasLiked ? 'pi-heart-fill' : 'pi-heart', 'text-violet-500', 'cursor-pointer']"
                @click="toggleLike(publication)">
              </i>
              <p class="text-gray-600 text-sm">{{ publication.likes || 0 }} me gusta</p>
            </div>

            <!-- Comentarios -->
            <div class="flex gap-2">
              <i class="pi pi-comments text-violet-500 cursor-pointer" @click="toggleComments(publication)"></i>
              <p class="text-gray-600 text-sm">{{ publication.comments?.length || 0 }} comentarios</p>
            </div>
          </div>

          <!-- Sección de comentarios -->
          <div v-if="publication.showComments" class="mt-4">
            <ul class="space-y-2">
              <li v-for="comment in publication.comments" :key="comment.id" class="bg-gray-100 p-2 rounded">
                <p class="text-sm text-gray-700">
                  <strong>{{ comment.nombreUsuario }}:</strong> {{ comment.contenido }}
                </p>
                <p class="text-xs text-gray-500">Publicado el: {{ formatDate(comment.fechaComentario) }}</p>
              </li>
            </ul>

            <!-- Formulario para agregar un comentario -->
            <form @submit.prevent="addComment(publication)" class="mt-4">
              <textarea
                v-model="publication.newComment"
                placeholder="Escribe un comentario..."
                class=" text-black w-full border rounded p-2 mb-2"
              ></textarea>
              <button type="submit" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-800">
                Agregar comentario
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { usePublicationsStore } from '@/stores/publicationtsStore';
import CommentsService from '@/services/CommentService';
import LikeService from '@/services/LikeService';

const publicationsStore = usePublicationsStore();
const { loading, error } = publicationsStore;
const searchQuery = ref(''); // Añadido para el buscador

// Computed para filtrar publicaciones
const filteredPublications = computed(() => {
  return publicationsStore.publications.filter(publication =>
    publication.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Cargar publicaciones al montar el componente
onMounted(() => {
  publicationsStore.fetchPublications();
});

// Formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

// Alternar likes
const toggleLike = async (publication: any) => {
  try {
    if (publication.hasLiked) {
      // Eliminar like
      const message = await LikeService.removeLike(publication.id);
      console.log(message); // Mensaje del backend
      publication.totalLikes -= 1;
    } else {
      // Agregar like
      const message = await LikeService.addLike(publication.id);
      console.log(message); // Mensaje del backend
      publication.totalLikes += 1;
    }
    publication.hasLiked = !publication.hasLiked; // Alternar el estado de "Me gusta"
  } catch (error) {
    console.error('Error al alternar el like:', error);
  }
};

// Alternar visibilidad de comentarios
const toggleComments = (publication: any) => {
  publication.showComments = !publication.showComments;
};

// Agregar un comentario
const addComment = async (publication: any) => {
  if (!publication.newComment.trim()) return; // Verificar que el comentario no esté vacío

  try {
    // Llamar al servicio para agregar el comentario
    const newComment = await CommentsService.createComment({
      publicacionId: publication.id,
      contenido: publication.newComment,
    });

    // Agregar el comentario al estado local
    publication.comments.push(newComment);
    publication.totalComments += 1;

    // Limpiar el campo de texto
    publication.newComment = '';
  } catch (error) {
    console.error('Error al agregar comentario:', error);
  }
};

// Watcher para los comentarios
watch(
  () => publicationsStore.publications,
  (newPublications, oldPublications) => {
    // Aquí puedes actualizar los nombres de los usuarios si es necesario
    newPublications.forEach(publication => {
      publication.comments.forEach(comment => {
        if (!comment.nombreUsuario) {
          const user = JSON.parse(localStorage.getItem('user') as string);
          comment.nombreUsuario = user.userName;        }
      });
    });
  },
  { deep: true }
);
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
