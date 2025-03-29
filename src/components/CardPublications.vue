<template>
  <section>
    <Toast />
    <div class="container">
      <div v-if="loading">Cargando publicaciones...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else class="content" v-for="publication in publicationsStore.publications" :key="publication.id">
        <div class="flex gap-4 items-center">
          <router-link :to="{ name: 'Perfil', params: { id: publication.userId } }">
            <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
          </router-link>
          <div class="flex flex-col">
            <router-link :to="{ name: 'Perfil', params: { id: publication.userId } }" class="text-gray-600 hover:text-purple-600">
              {{ publication.userName || 'Usuario desconocido' }}
            </router-link>
            <p class="text-gray-600 text-sm">{{ formatDate(publication.publicationDate) }}</p>
            <p v-if="publication.lastEditedDate" class="text-gray-600 text-sm">
              Editado el: {{ formatDate(publication.lastEditedDate) }}
            </p>
          </div>
        </div>

        <div class="w-full px-6 flex flex-col gap-4">
          <p class="text-gray-600 font-semibold">{{ publication.title }}</p>
          <p class="text-gray-600">{{ publication.content }}</p>
          <img v-if="publication.imageUrl" :src="publication.imageUrl" alt="" class="img-publication">

          <div class="flex gap-5 justify-between items-center">
            <div class="flex gap-5">
              <div class="flex gap-2">
                <i
                  :class="['pi', publication.hasLiked ? 'pi-heart-fill' : 'pi-heart', 'text-violet-500', 'cursor-pointer']"
                  @click="toggleLike(publication)">
                </i>
                <p class="text-gray-600 text-sm">{{ publication.likes || 0 }} me gusta</p>
              </div>

              <div class="flex gap-2">
                <i class="pi pi-comments text-violet-500 cursor-pointer" @click="toggleComments(publication)"></i>
                <p class="text-gray-600 text-sm">{{ publication.comments?.length || 0 }} comentarios</p>
              </div>
            </div>

            <div v-if="isOwner(publication.userId)">
              <button class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm mr-2" @click="openEditModal(publication)">
                Editar
              </button>
              <button v-if="!publication.isHidden" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm mr-2" @click="hidePublication(publication.id)">
                Ocultar
              </button>
              <button v-else class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm" @click="unhidePublication(publication.id)">
                Desocultar
              </button>
            </div>
          </div>

          <div v-if="publication.showComments" class="mt-4">
            <ul class="space-y-2">
              <li v-for="comment in publication.comments" :key="comment.id" class="bg-gray-100 p-2 rounded">
                <p class="text-sm text-gray-700">
                  <strong>{{ comment.nombreUsuario }}:</strong> {{ comment.contenido }}
                </p>
                <p class="text-xs text-gray-500">Publicado el: {{ formatDate(comment.fechaComentario) }}</p>
              </li>
            </ul>

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
import { ref, onMounted, watch, computed } from 'vue';
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
});

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

// Alternar likes (sin cambios)
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

// Alternar visibilidad de comentarios (sin cambios)
const toggleComments = (publication: any) => {
  publication.showComments = !publication.showComments;
};

// Agregar un comentario (sin cambios)
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

// Funciones para ocultar y desocultar (sin cambios relevantes)
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

// Watcher para los comentarios (sin cambios)
watch(
  () => publicationsStore.publications,
  (newPublications, oldPublications) => {
    newPublications.forEach(publication => {
      publication.comments.forEach(comment => {
        if (!comment.nombreUsuario) {
          comment.nombreUsuario = 'Usuario desconocido';
        }
      });
    });
  },
  { deep: true }
);
</script>

<style scoped>
section {
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

img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}

.action-add {
  display: flex;
  justify-content: space-between;
}
</style>
