<template>
  <LayoutAdmin>
    <template #default>
      <h1 class="text-2xl font-semibold mb-4">Gestión de Usuarios</h1>
      <table class="min-w-full bg-white shadow rounded">
        <thead>
          <tr class="bg-gray-200 text-left text-black font-bold ">
            <th class="p-3 cursor-pointer hover:bg-gray-400" @click="sortTable('userName')">Nombre de usuario</th>
            <th class="p-3 cursor-pointer hover:bg-gray-400" @click="sortTable('email')">Correo</th>
            <th class="p-3 cursor-pointer hover:bg-gray-400" @click="sortTable('fechaCreacion')">Fecha de creación</th>
            <th class="p-3 cursor-pointer hover:bg-gray-400" @click="sortTable('role')">Rol</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in sortedUsers" :key="user.id" class="border-b hover:bg-gray-100 text-black">
            <td class="p-3">{{ user.userName }}</td>
            <td class="p-3">{{ user.email }}</td>
            <td class="p-3">{{ formatDate(user.fechaCreacion ?? "") }}</td>
            <td class="p-3">
              <span class="px-2 py-1 rounded text-white text-sm" :class="user.role === 'Admin'
                ? 'bg-red-500'
                : user.role === 'User'
                  ? 'bg-blue-500'
                  : 'bg-gray-500'">
                {{ user.role ?? "Desconocido" }}
              </span>
            </td>
            <td class="p-3">
              <div class="flex space-x-2" v-if="!isCurrentUser(user.id)">
                <button @click="editUser(user.id)"
                  class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                  Editar
                </button>
                <button @click="confirmDelete(user.id)"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                  Eliminar
                </button>
              </div>
              <span v-else class="text-gray-500">No disponible</span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </LayoutAdmin>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { computed } from "vue";
import userAdminService from "@/services/admin/userAdminService";
import type { User } from "@/interfaces/UserEditInterface";
import LayoutAdmin from "@/layouts/LayoutAdmin.vue";

const users = ref<User[]>([]);
const sortKey = ref<string>('userName');
const sortOrder = ref<'asc' | 'desc'>('asc');
const currentUserId = ref<string | null>(null); // Almacenará el ID del usuario actual

// Función para verificar si un usuario es el usuario actual
const isCurrentUser = (userId: string) => {
  return userId === currentUserId.value;
};

// Función para obtener el ID del usuario actual (puedes implementar esto según tu autenticación)
const getCurrentUserId = async () => {
  try {
    // Aquí deberías implementar la lógica para obtener el ID del usuario actual
    // Por ejemplo, podrías tenerlo en el localStorage o hacer una petición al backend
    // Esto es un ejemplo, ajusta según tu implementación real
    const token = localStorage.getItem("token");
    if (token) {
      // Decodificar el token para obtener el ID (esto depende de cómo esté estructurado tu token)
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserId.value = payload.sub || payload.nameid;
    }
  } catch (error) {
    console.error("Error al obtener el ID del usuario actual:", error);
  }
};

const sortTable = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const sortedUsers = computed(() => {
  return [...users.value].sort((a, b) => {
    const valueA = a[sortKey.value];
    const valueB = b[sortKey.value];

    if (typeof valueA === 'string') {
      return sortOrder.value === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else if (typeof valueA === 'number' || valueA instanceof Date) {
      return sortOrder.value === 'asc' ? valueA - valueB : valueB - valueA;
    } else {
      return 0;
    }
  });
});

// Función para editar usuario
const editUser = (userId: string) => {
  console.log("Editar usuario:", userId);
  // Aquí puedes implementar la navegación a la página de edición
  // o mostrar un modal de edición
};

// Función para confirmar eliminación
const confirmDelete = (userId: string) => {
  if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    deleteUser(userId);
  }
};

// Función para eliminar usuario
const deleteUser = async (userId: string) => {
  try {
    await userAdminService.deleteUser(userId);
    // Actualizar la lista de usuarios después de eliminar
    users.value = users.value.filter(user => user.id !== userId);
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    alert("No se pudo eliminar el usuario");
  }
};

onMounted(async () => {
  try {
    await getCurrentUserId(); // Obtener el ID del usuario actual primero
    users.value = await userAdminService.getAllUsers();
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}
</script>