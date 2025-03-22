<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const router = useRouter();
const authStore = useAuthStore();
const isAuthenticated = computed(() => !!authStore.token);

// Redirigir al login si el usuario no está autenticado
watch(isAuthenticated, (newValue) => {
  if (!newValue) {
    router.push({ name: 'login' });
  }
});
</script>

<template>
    <HeaderComponent/>
    <div class="flex h-screen bg-gray-100">

        <!-- Sidebar -->
        <aside class="w-84 bg-black text-white p-6 h-screen">
            <div class="flex items-center space-x-2">
                <img src="../assets/images/login/image1.png" alt="Logo" class="w-10 h-10" />
                <span class="text-xl font-bold">Navega por las Publicaciones</span>
            </div>
            <input type="text" placeholder="Buscar" class="mt-4 w-full p-2 bg-gray-600 rounded-lg placeholder:text-gray-100 text-white" />
            <div class="mt-6">
                <p class="text-sm">✨ ¡Bienvenido!</p>
            </div>
            <nav class="mt-6">
                <ul class="space-y-2">
                    <RouterLink to="/home" class="cursor-pointer">
                        <li>📌 Inicio</li>
                    </RouterLink>
                    <RouterLink to="/user-profile" class="cursor-pointer">
                        <li>🚀 Perfil</li>
                    </RouterLink>
                </ul>
            </nav>
        </aside>

        <!-- Main content -->
        <main class="ml-24 flex-1 overflow-y-auto p-6">
            <!-- Encabezado -->
            <div class="bg-white p-4 rounded-lg shadow-md">
                <li>
                    <p class="font-bold text-lg text-black">Bienvenido Usuario</p>
                </li>
                <li>
                    <p class="text-sm text-gray-600">Comparte tu experiencia y conocimientos para que más personas te
                        conozcan.</p>
                </li>
            </div>

            <!-- Lista de publicaciones -->
            <div class="mt-6 space-y-4">
                <!-- Aquí irán las publicaciones -->
                <PostCard v-for="post in posts" :key="post.id" :post="post" />
            </div>
        </main>
    </div>
    <FooterComponent/>
</template>

<script lang="ts">

export default {
    data() {
        return {
            posts: []
        };
    }
};
</script>

<style>
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}
</style>
