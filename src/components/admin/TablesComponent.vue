<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
  users: Array<{ userName: string; email: string }>;
  loading: boolean;
  error: string | null;
}>();

</script>
<template>
  <section class="m-section">
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
             <button class="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-700">Eliminar</button>
           </template>
         </Column>
       </DataTable>
     </div>
   </div>
 </section>
</template>
