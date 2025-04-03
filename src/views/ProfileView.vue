<template>
  <layoutComponent />
  <div class="main-content">
    <div class="content-center max-w-6xl mx-auto px-4">
      <section>
        <div class="container">
          <div class=" ">
            <div class="">
              <!-- Encabezado del perfil -->
              <div class="bg-black rounded-lg shadow-md p-6 mb-6">
                <div class="flex flex-col md:flex-row items-center gap-6">
                  <!-- Avatar -->
                  <!-- <img :src="`https://ui-avatars.com/api/?name=${user.userName}&background=random`" alt="Avatar"
                        class="w-24 h-24 rounded-full" /> -->
                  <Avatar
                    icon="pi pi-user"
                    class="mr-2"
                    size="xlarge"
                    style="background-color: #ece9fc; color: #2a1261"
                    shape="circle"
                  />

                  <!-- Información del usuario -->
                  <div class="flex-1">
                    <h1 class="text-2xl font-bold text-gray-900">
                      {{ user.userName }}
                    </h1>
                    <p class="text-white">{{ user.email }}</p>
                  </div>
                </div>
              </div>

              <!-- Mensaje de error -->
              <div
                v-if="error"
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
              >
                {{ error }}
              </div>

              <!-- Publicaciones del usuario -->
              <div>
                <div class="flex justify-between">
                  <RouterLink to="/home" class="cursor-pointer">
                    <p class="text-lg font-bold text-purple-500 hover:text-purple-700">
                      ← Volver a Inicio
                    </p>
                  </RouterLink>
                </div>
                <div v-if="loading" class="flex justify-center py-8">
                  <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                  ></div>
                </div>

                <div
                  v-else-if="publications.length === 0"
                  class="bg-white rounded-lg shadow-md p-6 text-center"
                >
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
    </div>
  </div>
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
  email: "",
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
    error.value = "No se pudo cargar el perfil. Por favor, inténtalo de nuevo más tarde.";

    // Resetear datos en caso de error
    user.value = {
      id: userId.value,
      userName: "Usuario no encontrado",
      email: "",
    };
    publications.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Aplica la imagen de fondo a toda la pantalla */
.main-content {
  padding: 1rem;
  transition: margin-left 0.3s;
  min-height: 100vh; /* Que ocupe toda la altura */
  background: url("@/assets/images/Fondo.jpeg") no-repeat center center fixed,
    linear-gradient(to bottom, #a237b3, #6d0a26);
  background-size: cover;
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
