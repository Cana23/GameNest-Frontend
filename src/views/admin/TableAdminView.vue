<template>
  <layoutComponent/>
  <Toast />
  <section class="my-7">
    <div class="container">
      <div class="flex justify-between items-center">
        <h1>Administradores</h1>
        <button class="bg-green-500 px-8 py-2 rounded-2xl hover:bg-green-600 cursor-pointer font-semibold" @click="visible = true">Crear</button>
      </div>
    </div>
    <Dialog :draggable="false" v-model:visible="visible" modal header="Crear administrador"
    :style="{ width: '50rem', backgroundColor: 'white', color: '#8600AF', padding: '10px 20px' }">
    <div class="flex flex-col gap-5">
      <form @submit.prevent="submitForm" novalidate class="w-full flex flex-col gap-5">
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
        <div class="relative">
                <FloatLabel variant="on" class="bg-white">
                  <Password :feedback="false" id="password" toggleMask v-model="password" required
                    :class="{ 'w-full border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.password }" />
                  <label for="password" class="bg-white">Contraseña</label>
                </FloatLabel>
                <span v-if="errors.password" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{ errors.password }}</span>
              </div>
              <div class="relative">
                <FloatLabel variant="on" class="bg-white">
                  <Password :feedback="false" id="confirmPassword" toggleMask v-model="confirmPassword" required
                    :class="{ 'w-full border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.confirmPassword }" />
                  <label for="confirmPassword" class="bg-white">Confirmar contraseña</label>
                </FloatLabel>
                <span v-if="errors.confirmPassword" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{ errors.confirmPassword }}</span>
              </div>
        <div class="flex justify-end gap-4">
          <button type="button" @click="visible = false"
            class="py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-700 cursor-pointer">Cancelar</button>
          <button type="submit"
            class="py-2 px-4 text-white rounded-xl bg-purple-500 hover:bg-purple-600 cursor-pointer">crear</button>
        </div>

      </form>
    </div>
  </Dialog>
    </section>
    <tablesComponent
   :users="adminStore.admins"
   :loading="loading"
   :error="error"
   :key="AdminComponentKey"/>


</template>

<script lang="ts" setup>
import layoutComponent from '@/components/layoutComponent.vue';
import { useAdminStore } from '@/stores/adminStore';
import { ref, onMounted, watch, type Ref } from 'vue';
import { useRoute } from "vue-router";
import TablesComponent from "@/components/admin/TablesComponent.vue";
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?¡¿/\\|`~'"]).{6,}$/;
const schema = yup.object({
  userName: yup.string().required('El Nombre es requerido'),
  email: yup.string().email('Correo incorrecto').required('El correo es requerido'),
  password: yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(passwordRegex, "La contraseña debe contener al menos una mayúscula, un número y un símbolo (!@#$%^&*()_+{}[]:;<>,.?¡¿/\\|`~')")
    .required('La contraseña es requerida'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Debes confirmar tu contraseña')
});
const { errors, defineField, validate } = useForm({
  validationSchema: schema
});

const [userName, userNameAttrs] = defineField('userName');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');

const route = useRoute();
const adminStore = useAdminStore();
const { loading, error } = adminStore;
const AdminComponentKey = ref(0);
const visible = ref(false);
const authStore = useAuthStore();
const backendErrors = ref<string[]>([]);

onMounted(() => {
 adminStore.fetchAdmins();
});

watch(route, () => {
  adminStore.fetchAdmins();
  AdminComponentKey.value++;
});

const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Creación exitosa', detail: 'El administrador se creo correctamente' });
};

const submitForm = async () => {
  const result = await validate();

  if (!result.valid) {
    console.log("Errores en el formulario:", errors);
    backendErrors.value = [];
    return;
  }

  console.log("Formulario válido. Enviando datos...");

  const adminData:any = {
    UserName: userName.value,
    Email: email.value,
    Password: password.value,
  };

  try {
    await adminStore.createAdmin(adminData);
    await showSuccess();
    visible.value = false;
  } catch (error) {
    console.error("Error al crear la publicación:", error);
  }
};
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
