<template>
  <layoutComponent />
  <section>
    <div class="container">
      <div class=" ">
        <div class="">
          <!-- Encabezado del perfil -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex flex-col md:flex-row items-center gap-6">
              <!-- Avatar -->
              <!-- <img :src="`https://ui-avatars.com/api/?name=${user.userName}&background=random`" alt="Avatar"
                        class="w-24 h-24 rounded-full" /> -->
              <Avatar icon="pi pi-user" class="mr-2" size="xlarge" style="background-color: #ece9fc; color: #2a1261"
                shape="circle" />

              <!-- Información del usuario -->
              <div class="flex-1">
                <h1 class="text-2xl font-bold text-gray-900">
                  {{ user.userName }}
                </h1>
                <p class="text-gray-600">{{ user.email }}</p>
              </div>
            </div>
          </div>

          <!-- Mensaje de error -->
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {{ error }}
          </div>

          <!-- Publicaciones del usuario -->
          <div>
            <div class="flex justify-between">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Publicaciones de {{ user.userName }}
              </h2>
              <RouterLink to="/home" class="cursor-pointer">
                <p class="text-lg font-bold text-purple-500 hover:text-purple-700">← Volver a Inicio</p>
              </RouterLink>
            </div>
            <div v-if="loading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>

            <div v-else-if="publications.length === 0" class="bg-white rounded-lg shadow-md p-6 text-center">
              <p class="text-gray-500">Este usuario no tiene publicaciones aún.</p>
            </div>
            <div v-else class="space-y-6">
              <UserPublications :Publications="publications" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProfileService from "@/services/ProfileService";
import type { User } from "@/interfaces/UserEditInterface";
import type { Publication } from "@/interfaces/PublicationInterface";
import layoutComponent from "@/components/layoutComponent.vue";
import UserPublications from "@/components/UserPublications.vue";

const user = ref<User>({
  id: "",
  userName: "",
  email: ""
});
const publications = ref<Publication[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    const profileData = await ProfileService.getUserProfile();
    user.value = {
      ...profileData,
    };

    // Obtener publicaciones del usuario desde el servicio
    publications.value = await ProfileService.getUserPublications();
    console.log(publications.value);
  } catch (err) {
    console.error("Error loading profile:", err);
    error.value =
      "No se pudo cargar el perfil. Por favor, inténtalo de nuevo más tarde.";

    // Resetear datos en caso de error
    user.value = {
      id: userId.value,
      userName: "Usuario no encontrado",
      email: ""
    };
    publications.value = [];
  } finally {
    loading.value = false;
  }
});

</script>

<style scoped>
section {
  padding-left: 335px;
}
</style>
