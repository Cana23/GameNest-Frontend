<template>
  <LayoutAdmin>
    <template #default>
      <h1 class="text-2xl font-semibold mb-4">Gestión de Comentarios</h1>
      <table class="min-w-full bg-white shadow rounded">
        <thead>
          <tr class="bg-gray-200 text-left text-black font-bold">
            <th class="p-3 cursor-pointer hover:bg-gray-400" @click="SortTable('nombreUsuario')">Nombre de usuario</th>
            <th class="p-3 cursor-pointer hover:bg-gray-400" @click="SortTable('contenido')">Contenido</th>
            <th class="p-3 cursor-pointer hover:bg-gray-400" @click="SortTable('fechaComentario')">Fecha de comentario</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="Comentario in SortedComments" :key="Comentario.id" class="border-b hover:bg-gray-100 text-black">
            <td class="p-3">{{ Comentario.nombreUsuario }}</td>
            <td class="p-3">{{ Comentario.contenido }}</td>
            <td class="p-3">{{ FormatDate(Comentario.fechaComentario) }}</td>
            <td class="p-3">
              <div class="flex space-x-2">
                <button @click="ConfirmDelete(Comentario.id)"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </LayoutAdmin>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import LayoutAdmin from "@/layouts/LayoutAdmin.vue";
import type { Comment } from "@/interfaces/PublicationInterface";
import adminService from "@/services/admin/adminService";

const Comentarios = ref<Comment[]>([]);
const ClaveOrdenamiento = ref<keyof Comment>('nombreUsuario');
const Orden = ref<'asc' | 'desc'>('asc');

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const SortTable = (Clave: keyof Comment) => {
  if (ClaveOrdenamiento.value === Clave) {
    Orden.value = Orden.value === 'asc' ? 'desc' : 'asc';
  } else {
    ClaveOrdenamiento.value = Clave;
    Orden.value = 'asc';
  }
};

const SortedComments = computed(() => {
  return [...Comentarios.value].sort((A, B) => {
    const ValorA = A[ClaveOrdenamiento.value];
    const ValorB = B[ClaveOrdenamiento.value];

    if (typeof ValorA === 'string') {
      return Orden.value === 'asc' ? ValorA.localeCompare(ValorB) : ValorB.localeCompare(ValorA);
    } else if (typeof ValorA === 'number' || ValorA instanceof Date) {
      return Orden.value === 'asc' ? (ValorA as number) - (ValorB as number) : (ValorB as number) - (ValorA as number);
    } else {
      return 0;
    }
  });
});

const ConfirmDelete = async (ComentarioId: number) => {
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
    await DeleteComment(ComentarioId);
  }
};

const DeleteComment = async (ComentarioId: number) => {
  try {
    await adminService.deleteComment(ComentarioId);
    Comentarios.value = Comentarios.value.filter(C => C.id !== ComentarioId);

    Toast.fire({
      icon: "success",
      title: "Comentario eliminado",
    });
  } catch (error) {
    console.error("Error al eliminar el comentario:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar el comentario",
    });
  }
};

onMounted(async () => {
  try {
    Comentarios.value = await adminService.getAllComments();
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    Swal.fire({
      icon: "error",
      title: "Error al cargar",
      text: "No se pudieron obtener los comentarios",
    });
  }
});

function FormatDate(Iso: string) {
  return new Date(Iso).toLocaleString();
}
</script>
