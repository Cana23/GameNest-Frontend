<template>
  <layoutComponent/>
  <section class="m-section">
   <div class="container">
     <div class="content">
       <DataTable :value="userStore.users" tableStyle="min-width: 50rem" class="custom-table">
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
         <!-- <Column field="status" header="Estado" headerClass="bg-gray-200 text-gray-600 py-3 px-2">
           <template #body="slotProps">
             <span :class="{'text-green-500': slotProps.data.status === 'Activo', 'text-red-500': slotProps.data.status === 'Inactivo'}">
               <p class="py-3 px-2">{{ slotProps.data.status }}</p>
             </span>
           </template>
         </Column> -->
         <Column header="Acciones" headerClass="bg-gray-200 text-gray-600 py-3 px-2">
           <template #body="slotProps">
             <button class="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700">Editar</button>
             <button class="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-700">Eliminar</button>
           </template>
         </Column>
       </DataTable>
     </div>
   </div>
 </section>
</template>

<script lang="ts" setup>
import layoutComponent from '@/components/layoutComponent.vue';
import { useAdminStore } from '@/stores/adminStore';
import { ref, onMounted, watch, type Ref } from 'vue';
import type { User } from '../../interfaces/UserEditInterface';

const userStore = useAdminStore();
const { loading, error } = userStore;

onMounted(() => {
 userStore.fetchUsers();
});
</script>

<style scoped>
.bg-gradient-to-b {
 padding: 10px;
 text-align: left;
}
section{
 padding-left: 256px;
}
</style>
