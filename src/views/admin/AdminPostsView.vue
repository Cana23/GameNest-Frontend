<template>
  <LayoutAdmin>
    <template #default>
      <h1 class="text-2xl font-semibold mb-4">Gestión de Publicaciones</h1>
      <table class="min-w-full bg-white shadow rounded">
        <thead>
          <tr class="bg-gray-200 text-left text-black font-bold">
            <th class="p-3">Título</th>
            <th class="p-3">Contenido</th>
            <th class="p-3">Fecha de Publicación</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="publicacion in Publicaciones" :key="publicacion.id" class="border-b hover:bg-gray-100 text-black">
            <td class="p-3">{{ publicacion.title }}</td>
            <td class="p-3">{{ publicacion.content }}</td>
            <td class="p-3">{{ FormatDate(publicacion.publicationDate) }}</td>
            <td class="p-3">
              <button @click="ConfirmDelete(publicacion.id)"
                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </LayoutAdmin>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import LayoutAdmin from "@/layouts/LayoutAdmin.vue";
import adminService from "@/services/admin/adminService";
import type { Publication } from "@/interfaces/PublicationInterface";

const Publicaciones = ref<Publication[]>([]);

const ConfirmDelete = async (PublicacionId) => {
  const Result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No se puede revertir esta acción!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e3342f",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (Result.isConfirmed) {
    await DeletePublication(PublicacionId);
  }
};

const DeletePublication = async (PublicationId) => {
  try {
    await adminService.deletePost(PublicationId);
    Publicaciones.value = Publicaciones.value.filter(p => p.id !== PublicationId);
    Toast.fire({
      icon: "success",
      title: "Publicación eliminado",
    });
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar la publicación" });
  }
};

onMounted(async () => {
  try {
    Publicaciones.value = await adminService.getAllPosts();
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    Swal.fire({ icon: "error", title: "Error al cargar", text: "No se pudieron obtener las publicaciones" });
  }
});

const FormatDate = (Iso) => new Date(Iso).toLocaleString();
</script>
