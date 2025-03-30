<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { defineProps } from 'vue';
import { useAdminStore } from "@/stores/adminStore";
import { useToast } from "primevue/usetoast";
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';

const visibleDelete = ref(false);

const adminStore = useAdminStore();
const visible = ref(false);
const toast = useToast();
const selectedUserId = ref<string | null>(null);
  const backendErrors = ref<string[]>([]);
const props = defineProps<{
  users: Array<{ id: string, userName: string; email: string }>;
  loading: boolean;
  error: string | null;
}>();

const schema = yup.object({
  userName: yup.string().required('El Nombre es requerido'),
  email: yup.string().email('Correo incorrecto').required('El correo es requerido'),
});
const { errors, defineField, validate, setValues  } = useForm({
  validationSchema: schema
});

const [userName, userNameAttrs] = defineField('userName');
const [email, emailAttrs] = defineField('email');

const openEditDialog = (user: { id: string; userName: string; email: string }) => {
  selectedUserId.value = user.id;
  setValues({
    userName: user.userName,
    email: user.email,
  });
  visible.value = true;
};

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

const submitForm = async () => {
  const result = await validate();

  if (!result.valid) {
    console.log("Errores en el formulario:", errors);
    backendErrors.value = [];
    return;
  }

  if (!selectedUserId.value) return;

  const adminData = {
    userName: userName.value,
    email: email.value,
  };

  try {
    await adminStore.updateAdmin(selectedUserId.value, adminData);

    toast.add({
      severity: "success",
      summary: "Actualización exitosa",
      detail: "El administrador se actualizó correctamente",
    });

    visible.value = false;
    await adminStore.fetchAdmins(); // Recargar la lista de administradores
  } catch (error) {
    console.error("Error al actualizar el administrador:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudo actualizar el administrador",
    });
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
             <button class="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer"
             @click="openEditDialog(slotProps.data)">Editar</button>
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

    <Dialog :draggable="false" v-model:visible="visible" modal header="Editar administrador"
    :style="{ width: '50rem', backgroundColor: 'white', color: '#8600AF', padding: '10px 20px' }">
    <div class="flex flex-col gap-5">
      <form @submit.prevent="submitForm" novalidate class="w-full flex flex-col gap-5 mt-4">

        <div class="relative">
          <FloatLabel variant="on" class="bg-white">
            <InputText id="userName" v-model="userName" required
              :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.username }" />
            <label for="userName" class="bg-white">Nombre de usuario</label>
          </FloatLabel>
          <span v-if="errors.userName" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{
            errors.userName }}</span>
        </div>
        <div class="relative">
          <FloatLabel variant="on" class="bg-white">
            <InputText id="email" v-model="email" required
              :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.email }" />
            <label for="email" class="bg-white">Correo electrónico</label>
          </FloatLabel>
          <span v-if="errors.email" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{
            errors.email }}</span>
        </div>
        <div class="flex justify-end gap-4">
          <button type="button" @click="visible = false"
            class="py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-700 cursor-pointer">Cancelar</button>
          <button type="submit"
            class="py-2 px-4 text-white rounded-xl bg-purple-500 hover:bg-purple-600 cursor-pointer">Actualizar</button>
        </div>

      </form>
    </div>
  </Dialog>

</template>

<style scoped>

section{
 padding-left: 256px;
}
</style>
