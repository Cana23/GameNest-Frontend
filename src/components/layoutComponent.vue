<script setup lang="ts">
import NavPorfileComponent from './NavPorfileComponent.vue';

</script>

<template>
    <div class="flex justify-between">
        <aside class="w-84 bg-black text-white p-6 h-screen fixed">
            <div class="flex items-center space-x-2">
                <img src="../assets/images/login/image1.png" alt="Logo" class="w-10 h-10" />
                <span class="text-xl font-bold">GameNest</span>
            </div>
            <input type="text" placeholder="Buscar"
                class="mt-4 w-full p-2 bg-gray-600 rounded-lg placeholder:text-gray-100 text-white" />
            <div class="mt-6">
                <p class="text-sm">✨ ¡Bienvenido!</p>
            </div>
            <nav class="mt-6">
                <ul class="space-y-2">
                    <RouterLink to="/home" class="cursor-pointer">
                        <li>📌 Inicio</li>
                    </RouterLink>
                    <RouterLink to="/user-profile" class="cursor-pointer">
                        <li>🚀 Editar Perfil</li>
                    </RouterLink>
                    <RouterLink to="/search-publication" class="cursor-pointer">
                        <li>🔎 Buscar publicaciones</li>
                    </RouterLink>
                </ul>
            </nav>
        </aside>
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


</style>
