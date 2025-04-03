<template>
  <layoutComponent />
  <div class="main-content">
    <div class="content-center max-w-6xl mx-auto px-4">
      <section>
        <div class="container">
          <div class="space-y-6">
            <!-- Encabezado del perfil -->
            <div class="bg-gradient-to-r from-[#1a1a2e] to-[#3b1685] rounded-lg shadow-lg p-6 mb-6 border border-[#6b46c1]">
              <div class="flex flex-col md:flex-row items-center gap-6">
                <!-- Avatar -->
                <Avatar
                  icon="pi pi-user"
                  class="mr-2"
                  size="xlarge"
                  style="background-color: #ece9fc; color: #2a1261"
                  shape="circle"
                />

                <!-- Información del usuario -->
                <div class="flex-1 text-neon-light">
                  <h1 class="text-2xl font-bold">{{ user.userName }}</h1>
                  <p class="text-neon-gray">{{ user.email }}</p>
                </div>
              </div>
            </div>

            <!-- Mensaje de error -->
            <div
              v-if="error"
              class="bg-red-900/50 border border-neon-red text-neon-light px-4 py-3 rounded mb-6"
            >
              {{ error }}
            </div>

            <!-- Publicaciones del usuario -->
            <div class="space-y-4">
              <RouterLink to="/home" class="inline-block">
                <p class="text-lg font-bold text-neon-purple hover:text-neon-blue transition-colors">
                  ← Volver a Inicio
                </p>
              </RouterLink>

              <div v-if="loading" class="flex justify-center py-8">
                <div
                  class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-purple"
                ></div>
              </div>

              <div
                v-else-if="publications.length === 0"
                class="bg-[#2d1065] rounded-lg shadow-md p-6 text-center border border-[#6b46c1]"
              >
                <p class="text-neon-gray">Este usuario no tiene publicaciones aún.</p>
              </div>

              <div v-else class="space-y-6">
                <UserPublications :Publications="publications" />
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

    publications.value = await ProfileService.getUserPublications();
    console.log(publications.value);
  } catch (err) {
    console.error("Error loading profile:", err);
    error.value = "No se pudo cargar el perfil. Por favor, inténtalo de nuevo más tarde.";

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
.main-content {
  padding-left: 335px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  min-height: 100vh;
  background:
              url("@/assets/images/Fondo.jpeg") no-repeat center center fixed;
  background-size: cover;
  background-attachment: fixed;
}

.content-center {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}


.text-neon-light {
  color: white;
}

.text-neon-gray {
  color: #94a3b8;
}

.text-neon-purple {
  color: #a78bfa;
}

.text-neon-blue {
  color: #60a5fa;
}

.text-neon-red {
  color: #ef4444;
}

.border-neon-red {
  border-color: #ef4444;
}

.transition-colors {
  transition: color 0.2s ease;
}

@media (max-width: 768px) {
  .main-content {
    padding-left: 0;
  }
}
</style>
