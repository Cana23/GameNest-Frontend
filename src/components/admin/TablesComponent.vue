<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { defineProps } from 'vue';
import { useAdminStore } from "@/stores/adminStore";
import { useToast } from "primevue/usetoast";
const visibleDelete = ref(false);

const adminStore = useAdminStore();
const toast = useToast();
const selectedUserId = ref<string | null>(null);
const props = defineProps<{
  users: Array<{ id: string, userName: string; email: string }>;
  loading: boolean;
  error: string | null;
}>();
const confirmDelete = (id: string) => {
  selectedUserId.value = id;
  visibleDelete.value = true;
};

const handleDelete = async () => {
  if (selectedUserId.value) {
    try {
      await adminStore.deleteAdmin(selectedUserId.value);
      toast.add({
        severity: "success",
        summary: "Eliminación exitosa",
        detail: "El administrador se eliminó correctamente",
      });
      visibleDelete.value = false;

      // Actualizar la lista después de eliminar
      await adminStore.fetchAdmins();
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el administrador",
      });
    }
  }
};
</script>
<template>
  <section>
   <div class="container">
     <div class="content">
       <DataTable :value="props.users"  tableStyle="min-width: 50rem" class="custom-table">
         <Column field="userName" header="Nombre de usuario" headerClass="bg-gray-200 text-gray-600 py-3 px-2">
           <template #body="slotProps" class="bg-white text-black">
             <p class="py-3 px-2">{{ slotProps.data.userName }}</p>
           </template>
         </Column>
         <Column field="email" header="Correo" headerClass="bg-gray-200 text-gray-600 py-3 px-2">
           <template #body="slotProps">
             <p class="py-3 px-2">{{ slotProps.data.email }}</p>
           </template>
         </Column>
         <Column header="Acciones" headerClass="bg-gray-200 text-gray-600 py-3 px-2">
           <template #body="slotProps">
             <button class="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700">Editar</button>
             <button class="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer"
             @click="confirmDelete(slotProps.data.id)">Eliminar</button>
           </template>
         </Column>

       </DataTable>
     </div>
   </div>
 </section>
 <Dialog
      v-model:visible="visibleDelete"
      modal header="Cerrar sesión"
      :style="{ width: '400px' }"
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    >
      <div class="p-4">
        <p class="text-gray-300 mb-4">¿Estás seguro de que deseas eliminar el administrador?</p>
        <div class="flex justify-end gap-4">
          <button @click="handleDelete()" class="ml-2 px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer">Sí</button>
          <button @click="visibleDelete = false" class="ml-2 px-4 py-1 bg-violet-500 text-white rounded-md hover:bg-violet-700 cursor-pointer">No</button>
        </div>
      </div>
    </Dialog>

</template>

<style scoped>

section{
 padding-left: 256px;
}
</style>
