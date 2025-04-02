<template>
  <LayoutAdmin>
    <template #default>
      <h1 class="text-2xl font-semibold mb-4">Gestión de Usuarios</h1>

      <!-- Filtros y ordenación -->
      <div class="mb-4 flex gap-4">
        <!-- Filtro por Rol -->
        <div>
          <select v-model="roleFilter" class="text-black p-2 border rounded">
            <option value="">Filtrar por rol</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>

        <!-- Ordenar por campo -->
        <div>
          <select v-model="sortKey" class="text-black p-2 border rounded">
            <option value="">Ordenar por...</option>
            <option value="userName">Ordenar por nombre</option>
            <option value="email">Ordenar por correo</option>
            <option value="fechaCreacion">Ordenar por fecha</option>
            <option value="role">Ordenar por rol</option>
          </select>
        </div>

        <!-- Dirección de ordenación -->
        <div>
          <select v-model="sortOrder" class="text-black p-2 border rounded">
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      <!-- Tabla de usuarios -->
      <table class="min-w-full bg-white shadow rounded">
        <thead>
          <tr class="bg-gray-200 text-left text-black font-bold">
            <th class="p-3">Nombre de usuario</th>
            <th class="p-3">Correo</th>
            <th class="p-3">Fecha de creación</th>
            <th class="p-3">Rol</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="border-b hover:bg-gray-100 text-black">
            <td class="p-3">{{ user.userName }}</td>
            <td class="p-3">{{ user.email }}</td>
            <td class="p-3">{{ formatDate(user.fechaCreacion ?? '') }}</td>
            <td class="p-3">
              <span class="px-2 py-1 rounded text-white text-sm" :class="user.role === 'Admin'
                ? 'bg-red-500'
                : user.role === 'User'
                  ? 'bg-blue-500'
                  : 'bg-gray-500'">
                {{ user.role ?? 'Desconocido' }}
              </span>
            </td>
            <td class="p-3">
              <div class="flex space-x-2" v-if="!isCurrentUser(user.id)">
                <button @click="openEditModal(user)"
                  class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                  Editar
                </button>
                <button @click="openDeleteModal(user)"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                  Eliminar
                </button>
              </div>
              <span v-else class="text-gray-500">No disponible</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- MODAL DE EDICIÓN -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded shadow w-96">
          <h2 class="text-xl text-black font-semibold mb-4">Editar Usuario</h2>
          <form @submit.prevent="submitEdit">
            <label class="text-black block mb-2 text-sm">Nombre de Usuario:</label>
            <input v-model="editForm.userName" class="w-full border p-2 rounded mb-4" required />

            <label class="text-black block mb-2 text-sm">Correo:</label>
            <input type="email" v-model="editForm.email" class="w-full border p-2 rounded mb-4" required />

            <div class="flex justify-end space-x-2">
              <button type="button" @click="closeEditModal"
                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded shadow w-96">
          <h2 class="text-xl text-black font-semibold mb-4">Confirmar Eliminación</h2>
          <p class="mb-4 text-black">¿Estás seguro de eliminar al usuario <strong>{{ selectedUser?.userName }}</strong>?
          </p>
          <div class="flex justify-end space-x-2">
            <button @click="closeDeleteModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
            <button @click="deleteUser"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
          </div>
        </div>
      </div>
    </template>
  </LayoutAdmin>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import userAdminService from "@/services/admin/userAdminService";
import type { User } from "@/interfaces/UserEditInterface";
import LayoutAdmin from "@/layouts/LayoutAdmin.vue";

// Data
const users = ref<User[]>([]);
const sortKey = ref('userName');
const sortOrder = ref<'asc' | 'desc'>('asc');
const currentUserId = ref<string | null>(null);
const roleFilter = ref<string>(''); // Filtro de rol
const selectedUser = ref<User | null>(null);

// Modal edición
const showEditModal = ref(false);
const editForm = ref({
  id: '',
  userName: '',
  email: '',
});

// Modal eliminar
const showDeleteModal = ref(false);

// Funciones
const isCurrentUser = (userId: string) => userId === currentUserId.value;

const getCurrentUserId = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserId.value = payload.sub || payload.nameid;
    }
  } catch (error) {
    console.error("Error al obtener el ID del usuario actual:", error);
  }
};

const sortedUsers = computed(() => {
  return [...users.value].sort((a, b) => {
    let valueA = a[sortKey.value as keyof User];
    let valueB = b[sortKey.value as keyof User];

    // Manejo especial para fechas
    if (sortKey.value === 'fechaCreacion') {
      valueA = valueA ? new Date(valueA as string).getTime() : 0;
      valueB = valueB ? new Date(valueB as string).getTime() : 0;
    }

    // Convertir a string si es necesario
    const strA = String(valueA ?? '').toLowerCase();
    const strB = String(valueB ?? '').toLowerCase();

    return sortOrder.value === 'asc'
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });
});

// Filtrar usuarios
const filteredUsers = computed(() => {
  return sortedUsers.value.filter(user => {
    // Aplicar filtro de rol
    if (roleFilter.value && user.role !== roleFilter.value) {
      return false;
    }
    return true;
  });
});

// Editar usuario
const openEditModal = (user: User) => {
  selectedUser.value = user;
  editForm.value = {
    id: user.id,
    userName: user.userName,
    email: user.email,
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editForm.value = { id: '', userName: '', email: '' };
};

const submitEdit = async () => {
  try {
    await userAdminService.updateUser(editForm.value.id, {
      userName: editForm.value.userName,
      email: editForm.value.email,
    });
    const updatedUsers = await userAdminService.getAllUsers();
    users.value = updatedUsers;
    closeEditModal();
  } catch (error) {
    console.error("Error al editar usuario:", error);
    alert("Error al guardar cambios");
  }
};

// Eliminar usuario
const openDeleteModal = (user: User) => {
  selectedUser.value = user;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedUser.value = null;
};

const deleteUser = async () => {
  try {
    if (selectedUser.value) {
      await userAdminService.deleteUser(selectedUser.value.id);
      users.value = users.value.filter(user => user.id !== selectedUser.value?.id);
    }
    closeDeleteModal();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    alert("No se pudo eliminar el usuario");
  }
};

onMounted(async () => {
  await getCurrentUserId();
  users.value = await userAdminService.getAllUsers();
});

function formatDate(iso: string) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>