<script setup lang="ts">
import NavPorfileComponent from './NavPorfileComponent.vue';
import { ref } from 'vue';
import 'primeicons/primeicons.css';

const isSidebarCollapsed = ref(false);
</script>

<template>
    <div class="flex justify-between">
        <aside
            class="bg-gradient-to-b from-gray-900 to-blue-800 text-white p-6 h-screen fixed transition-all duration-300 overflow-hidden"
            :class="isSidebarCollapsed ? 'w-20' : 'w-64'"
        >
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2" :class="{ 'justify-center w-full': isSidebarCollapsed }">
                    <img src="../assets/images/login/image1.png" alt="Logo" class="w-10 h-10" />
                    <span class="text-xl font-bold" v-if="!isSidebarCollapsed">GameNest</span>
                </div>

                <button
                    @click="isSidebarCollapsed = !isSidebarCollapsed"
                    class="p-1 rounded-full hover:bg-blue-700 transition-all"
                    v-if="!isSidebarCollapsed"
                >
                    <i class="pi pi-angle-left"></i>
                </button>

                <button
                    @click="isSidebarCollapsed = !isSidebarCollapsed"
                    class="p-1 rounded-full hover:bg-blue-700 transition-all mx-auto mt-4"
                    v-if="isSidebarCollapsed"
                >
                    <i class="pi pi-angle-right"></i>
                </button>
            </div>

            <div class="mt-6">
                <p class="text-xl font-bold font-sans" :class="{ 'text-center': isSidebarCollapsed }">
                    <span v-if="isSidebarCollapsed">¡B!</span>
                    <span v-else>¡Bienvenido!</span>
                </p>
            </div>

            <nav class="mt-6">
                <ul class="space-y-2">
                    <RouterLink to="/home" class="nav-item flex items-center">
                        <i class="pi pi-home" :class="{ 'mx-auto': isSidebarCollapsed, 'mr-3': !isSidebarCollapsed }"></i>
                        <span v-if="!isSidebarCollapsed">Inicio</span>
                    </RouterLink>
                    <RouterLink to="/profile" class="nav-item flex items-center">
                        <i class="pi pi-user" :class="{ 'mx-auto': isSidebarCollapsed, 'mr-3': !isSidebarCollapsed }"></i>
                        <span v-if="!isSidebarCollapsed">Ver Publicaciones</span>
                    </RouterLink>
                    <RouterLink to="/user-profile" class="nav-item flex items-center">
                        <i class="pi pi-user-edit" :class="{ 'mx-auto': isSidebarCollapsed, 'mr-3': !isSidebarCollapsed }"></i>
                        <span v-if="!isSidebarCollapsed">Editar Información</span>
                    </RouterLink>

                </ul>
            </nav>
        </aside>

        <!-- Espacio para el sidebar cuando está expandido -->
        <div :class="isSidebarCollapsed ? 'w-20' : 'w-64'" class="transition-all duration-300"></div>

        <NavPorfileComponent />
    </div>
</template>

<style scoped>
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

.nav-item {
    display: flex;
    padding: 12px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.nav-item:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
}

.pi {
    font-size: 1.2rem;
}

/* Estilo para los botones */
button {
    transition: all 0.3s ease;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
