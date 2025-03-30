<template>
    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-800 text-white flex flex-col justify-between">
            <div>
                <div class="p-6 text-xl font-bold border-b border-gray-700">Dashboard Admin</div>

                <div class="p-4">
                    <div class="text-sm mb-4">Bienvenido, <span class="font-semibold">{{ user?.userName }}</span></div>

                    <nav class="flex flex-col gap-2">
                        <RouterLink to="/admin/users" class="hover:bg-gray-700 p-2 rounded">Usuarios</RouterLink>
                    </nav>
                </div>
            </div>

            <!-- Logout -->
            <div class="p-4 border-t border-gray-700">
                <button @click="showModal = true" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
                    Cerrar sesión
                </button>
            </div>
        </aside>

        <!-- Content -->
        <div class="flex-1 bg-gray-100 p-6">
            <!-- Aquí se renderiza el contenido pasado a través del slot 'default' -->
            <slot></slot>
        </div>

        <!-- Modal de confirmación -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 class="text-lg font-semibold mb-4">¿Deseas cerrar sesión?</h2>
                <div class="flex justify-end gap-4">
                    <button @click="showModal = false" class="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                    <button @click="handleLogout" class="px-4 py-2 bg-red-600 text-white rounded">Cerrar sesión</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { logout } from "@/services/authService";

const router = useRouter();
const showModal = ref(false);
const user = ref<{ userName: string } | null>(null);

onMounted(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
        user.value = JSON.parse(userData);
    }
});

const handleLogout = async () => {
    try {
        await logout();
        router.push("/login");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};
</script>
