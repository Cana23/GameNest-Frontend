<template>
  <section>
    <div class="container mt-8">
      <div v-if="loading">Cargando publicaciones...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else class="content" v-for="publication in publicationsStore.publications" :key="publication.id">
        <!-- Encabezado de la publicación -->
        <div class="flex justify-between items-start">
          <!-- Información del usuario -->
          <div class="flex gap-4 items-center">
            <router-link :to="{ name: 'Perfil', params: { id: publication.userId } }">
              <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
            </router-link>
            <div class="flex flex-col">
              <router-link :to="{ name: 'Perfil', params: { id: publication.userId } }" class="text-gray-600 hover:text-purple-600">
                {{ publication.userName || 'Usuario desconocido' }}
              </router-link>
              <p class="text-gray-600 text-sm">Publicado el {{ formatDate(publication.publicationDate) }}</p>
              <p v-if="publication.lastEditedDate" class="text-gray-600 text-sm">
                Editado el: {{ formatDate(publication.lastEditedDate) }}
              </p>
            </div>
          </div>

          <!-- Menú de tres puntos (solo para el propietario) -->
          <div v-if="isOwner(publication.userId)" class="relative">
            <button @click.stop="toggleOptions(publication.id)" class="p-1 rounded-full hover:bg-[#4c1d95]/60  transition-colors">
              <i class="pi pi-ellipsis-v text-gray-500"></i>
            </button>

           <!-- Menú desplegable -->
<div v-if="activeOptions === publication.id"
     class="absolute right-0 mt-2 w-48 bg-[#2d1065] rounded-md shadow-lg py-1 z-50 border border-neon-400">
  <button @click="openEditModal(publication); closeOptions();"
          class="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4c1d95]">
    <i class="pi pi-pencil mr-2 text-neon-300"></i> Editar publicación
  </button>
  <button v-if="!publication.isHidden"
          @click="hidePublication(publication.id); closeOptions();"
          class="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4c1d95]">
    <i class="pi pi-eye-slash mr-2 text-neon-300"></i> Ocultar publicación
  </button>
  <button v-else
          @click="unhidePublication(publication.id); closeOptions();"
          class="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4c1d95]">
    <i class="pi pi-eye mr-2 text-neon-300"></i> Desocultar
  </button>
</div>
          </div>
        </div>

        <!-- Contenido de la publicación -->
        <div class="w-full px-6 flex flex-col gap-4">
          <p class="text-gray-600 font-semibold">{{ publication.title }}</p>
          <p class="text-gray-600">{{ publication.content }}</p>
          <div class="image-container">
            <img v-if="publication.imageUrl" :src="publication.imageUrl" alt="Imagen de publicación" class="img-publication">
          </div>

          <!-- Interacciones -->
          <div class="flex gap-5 justify-between items-center">
            <div class="flex gap-5">
              <div class="flex gap-2">
                <i
                  :class="['pi', publication.hasLiked ? 'pi-heart-fill' : 'pi-heart', 'text-violet-500', 'cursor-pointer']"
                  @click="toggleLike(publication)">
                </i>
                <p class="text-gray-600 text-sm">{{ publication.totalLikes || 0 }} me gusta</p>
              </div>

              <div class="flex gap-2">
                <i class="pi pi-comments text-violet-500 cursor-pointer" @click="toggleComments(publication)"></i>
                <p class="text-gray-600 text-sm">{{ publication.comments?.length || 0 }} comentarios</p>
              </div>
            </div>
          </div>

         <!-- Comentarios -->
          <div v-if="publication.showComments" class="mt-4">
            <ul class="space-y-2">
              <li v-for="comment in publication.comments" :key="comment.id"
                  class="bg-[#130431] p-3 rounded-lg border border-[#6b46c1]">
                <p class="text-sm text-white">
                  <strong class="text-[#a78bfa]">{{ comment.nombreUsuario }}:</strong> {{ comment.contenido }}
                </p>
                <p class="text-xs text-[#cbd5e0] mt-1">Publicado el: {{ formatDate(comment.fechaComentario) }}</p>
              </li>
            </ul>

            <form @submit.prevent="addComment(publication)" class="mt-4">
              <textarea
                v-model="publication.newComment"
                placeholder="Escribe un comentario..."
                class="w-full bg-[#1a1a2e] border border-[#6b46c1] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#a78bfa]"
              ></textarea>
              <button type="submit" class="mt-2 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Agregar comentario
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal de edición -->
  <Dialog :draggable="false" v-model:visible="isEditModalVisible" modal header="Editar publicación"
    :style="{ width: '50rem', backgroundColor: 'white', color: '#8600AF', padding: '10px 20px' }">
    <div class="flex flex-col gap-5">
      <div class="flex gap-4 items-center">
        <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261"
          shape="circle" />
        <p class="text-gray-600">{{ authStore.user?.userName || "Usuario" }}</p>
      </div>
      <form @submit.prevent="submitEditForm" novalidate class="w-full flex flex-col gap-5">
        <div class="relative">
          <FloatLabel variant="on" class="bg-white">
            <InputText id="editTitle" v-model="editTitle" optional()
              :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': editErrors.title }" />
            <label for="editTitle" class="bg-white">Titulo de publicación</label>
          </FloatLabel>
          <span v-if="editErrors.title" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{
            editErrors.title }}</span>
        </div>
        <div class="relative">
          <FloatLabel variant="on" class="bg-white">
            <Textarea id="editContent" v-model="editContent" optional()
              :class="{ 'w-full text-gray-600 border-1 border-gray-300 rounded-2xl py-3 px-6': true, 'border-red-500': editErrors.content }"
              rows="5" cols="30" />
            <label for="editContent" class="bg-white">Comparte tu experiencia y conocimientos para que más personas te
              conozcan</label>
          </FloatLabel>
          <span v-if="editErrors.content" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{
            editErrors.content }}</span>
        </div>
        <div class="relative">
          <FloatLabel variant="on" class="bg-white">
            <InputText id="editImageUrl" v-model="editImageUrl" optional()
              :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': editErrors.imageUrl }" />
            <label for="editImageUrl" class="bg-white">Url de la imagen</label>
          </FloatLabel>
          <span v-if="editErrors.imageUrl" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{
            editErrors.imageUrl }}</span>
        </div>

        <div class="flex justify-end gap-4">
          <button type="button" @click="isEditModalVisible = false"
            class="py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-700 cursor-pointer">Cancelar</button>
          <button type="submit"
            class="py-2 px-4 text-white rounded-xl bg-purple-500 hover:bg-purple-600 cursor-pointer">Guardar cambios</button>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { usePublicationsStore } from '@/stores/publicationtsStore';
import CommentsService from '@/services/CommentService';
import LikeService from '@/services/LikeService';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from "primevue/usetoast";
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import PublicationsService from '@/services/PublicationService';

const publicationsStore = usePublicationsStore();
const authStore = useAuthStore();
const toast = useToast();
const { loading, error } = publicationsStore;

// Refs para el modal de edición
const isEditModalVisible = ref(false);
const publicationToEdit = ref<any>(null);
const editTitle = ref('');
const editContent = ref('');
const editImageUrl = ref('');

// Control del menú de opciones
const activeOptions = ref<string | null>(null);

// Formulario y validación para la edición
const editSchema = yup.object({
  title: yup.string().required('El titulo es requerido'),
  content: yup.string().required('El contenido es requerido'),
  imageUrl: yup.string().required('La URL de la imagen es requerida'),
});

const { errors: editErrors, defineField: defineEditField, validate: validateEditForm } = useForm({
  validationSchema: editSchema
});

const [editTitleField, editTitleAttrs] = defineEditField('title', { initialValue: editTitle });
const [editContentField, editContentAttrs] = defineEditField('content', { initialValue: editContent });
const [editImageUrlField, editImageUrlAttrs] = defineEditField('imageUrl', { initialValue: editImageUrl });

// Cargar publicaciones al montar el componente
onMounted(() => {
  publicationsStore.fetchPublications();
  document.addEventListener('click', handleClickOutside);
});

// Manejar clic fuera del menú
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.options-menu')) {
    closeOptions();
  }
};

// Alternar menú de opciones
const toggleOptions = (publicationId: string) => {
  event?.stopPropagation();
  activeOptions.value = activeOptions.value === publicationId ? null : publicationId;
};

// Cerrar menú de opciones
const closeOptions = () => {
  activeOptions.value = null;
};

// Formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

// Función para verificar si el usuario actual es el propietario de la publicación
const isOwner = (publicationUserId: string) => {
  return authStore.user?.id === publicationUserId;
};

// Abrir el modal de edición y cargar los datos de la publicación
const openEditModal = (publication: any) => {
  publicationToEdit.value = publication;
  editTitle.value = publication.title;
  editContent.value = publication.content;
  editImageUrl.value = publication.imageUrl || '';
  isEditModalVisible.value = true;
};

// Función para enviar los datos editados
const submitEditForm = async () => {
  if (!publicationToEdit.value) return;

  const result = await validateEditForm();
  if (!result.valid) {
    console.log("Errores en el formulario de edición:", editErrors);
    return;
  }

  const updatedPublication = {
    id: publicationToEdit.value.id,
    title: editTitle.value,
    content: editContent.value,
    imageUrl: editImageUrl.value,
  };

  try {
    await PublicationsService.updatePublication(updatedPublication.id, updatedPublication);
    toast.add({ severity: 'success', summary: 'Publicación actualizada', detail: 'La publicación se actualizó correctamente' });
    isEditModalVisible.value = false;
    publicationsStore.fetchPublications();
  } catch (error) {
    console.error("Error al actualizar la publicación:", error);
    toast.add({ severity: 'error', summary: 'Error al actualizar', detail: 'Hubo un problema al guardar los cambios' });
  }
};

// Alternar likes
const toggleLike = async (publication: any) => {
  try {
    if (publication.hasLiked) {
      const message = await LikeService.removeLike(publication.id);
      console.log(message);
      publication.totalLikes -= 1;
    } else {
      const message = await LikeService.addLike(publication.id);
      console.log(message);
      publication.totalLikes += 1;
    }
    publication.hasLiked = !publication.hasLiked;
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
  if (!publication.newComment.trim()) return;

  try {
    const newComment = await CommentsService.createComment({
      publicacionId: publication.id,
      contenido: publication.newComment,
    });
    publication.comments.push(newComment);
    publication.totalComments += 1;
    publication.newComment = '';
  } catch (error) {
    console.error('Error al agregar comentario:', error);
  }
};

// Funciones para ocultar y desocultar
const hidePublication = async (id: number) => {
  try {
    await PublicationsService.hidePublication(id);
    publicationsStore.fetchPublications();
    console.log(`Publicación con ID: ${id} oculta`);
  } catch (error) {
    console.error('Error al ocultar la publicación:', error);
  }
};

const unhidePublication = async (id: number) => {
  try {
    await PublicationsService.unhidePublication(id);
    publicationsStore.fetchPublications();
    console.log(`Publicación con ID: ${id} desocultada`);
  } catch (error) {
    console.error('Error al desocultar la publicación:', error);
  }
};

// Watcher para los comentarios
watch(
  () => publicationsStore.publications,
  (newPublications, oldPublications) => {
    newPublications.forEach(publication => {
      publication.comments.forEach(comment => {
        if (!comment.nombreUsuario) {
          const user = JSON.parse(localStorage.getItem('user') as string);
          comment.nombreUsuario = user.userName;
        }
      });
    });
  },
  { deep: true }
);

// Limpiar el event listener al desmontar
onMounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
section {
  padding-left: 335px;
}

.content {
  width: 100%;
  border: 1px solid #6b46c1; /* Borde morado */
  box-shadow: 0 4px 15px rgba(107, 70, 193, 0.3); /* Sombra morada */
  border-radius: 10px;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 25px;
  position: relative;
  background: linear-gradient(145deg, #1a1a2e, #3b1685); /* Degradado oscuro a morado */
  color: white; /* Texto blanco para todo el contenido */
}

/* También necesitarás actualizar los colores de texto dentro de la card */
.content .text-gray-600,
.content .text-gray-700,
.content .text-gray-500 {
  color: white !important;
}

/* Ajustar el menú desplegable para que combine */
.options-dropdown {
  background-color: #2d1065;
  border: 1px solid #6b46c1;
  box-shadow: 0 10px 15px -3px rgba(107, 70, 193, 0.3);

}

.option-item {
  color: white;
  transition: all 0.2s ease;
}

.option-item:hover {
  background-color: rgba(107, 70, 193, 0.3);
}

/* Ajustar el textarea para el modo oscuro */
.content textarea {
  background-color: #1a1a2e;
  color: white;
  border: 1px solid #6b46c1;
}

.content textarea::placeholder {
  color: #cbd5e0;
}

.img-publication {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.image-container {
  margin: 10px 0;
}

/* Estilos para el menú de opciones */
.options-menu {
  position: relative;
}

.options-button {
  padding: 0.25rem;
  border-radius: 9999px;
  transition: background-color 0.2s;
}

.options-button:hover {
  background-color: rgba(0, 0, 0, 0.05);

}

.options-dropdown {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 12rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  border: 1px solid #e5e7eb;
}

.option-item {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.2s;
}

.option-item:hover {
  background-color: #12409d;
}

.option-item i {
  margin-right: 0.5rem;
}
</style>
