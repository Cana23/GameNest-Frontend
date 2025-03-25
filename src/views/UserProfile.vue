<template>
  <NavPorfileComponent/>
  <section class="user-profile">
    <!-- <div class="bg-info"></div> -->
    <div class="container">
      <div class="content">
        <div class="image flex flex-col justify-center items-center">
          <img class="robot" src="../assets/images/login/image1.png" alt="">
          <h1 class="text-white text-center max-w-100 font-semibold">Perfil de Usuario</h1>
        </div>
        <div class="profile-details flex flex-col justify-center items-center">
          <div class="mb-8">
            <p class="text-center text-gray-600">Aquí puedes ver y editar la información de tu perfil.</p>
          </div>
          <div class="w-full max-w-md">
            <div class="flex flex-col gap-8">
              <div class="relative">
                <FloatLabel variant="on" class="bg-white">
                  <InputText id="user_name" v-bind="userAttrs" required
                    :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.user }"/>
                  <label for="user_name" class="bg-white">Nombre</label>
                </FloatLabel>
                <span v-if="errors.user" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{ errors.user }}</span>
              </div>
              <div class="relative">
                <FloatLabel variant="on" class="bg-white">
                  <InputText id="user_email" v-bind="emailAttrs" required
                    :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.email }"/>
                  <label for="user_email" class="bg-white">Correo</label>
                </FloatLabel>
                <span v-if="errors.email" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{ errors.email }}</span>
              </div>
              <div class="relative">
                <FloatLabel variant="on" class="bg-white">
                  <Password :feedback="false" id="user_password" toggleMask v-bind="passwordAttrs" required
                    :class="{ 'w-full border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.password }"/>
                  <label for="user_password" class="bg-white">Contraseña</label>
                </FloatLabel>
                <span v-if="errors.password" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{ errors.password }}</span>
              </div>
              <Button label="Guardar Cambios" severity="help" class="bg-purple-500 py-3 px-8 rounded-3xl text-white font-bold hover:bg-purple-800"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>

import NavPorfileComponent from '@/components/NavPorfileComponent.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const isAuthenticated = computed(() => !!authStore.token);

// Redirigir al login si el usuario no está autenticado
watch(isAuthenticated, (newValue) => {
  if (!newValue) {
    router.push({ name: 'login' });
  }
});

const schema = yup.object({
  user: yup.string().required('El Nombre es requerido'),
  email: yup.string().email('Correo incorrecto').required('El correo es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
});

const { errors, defineField, validate } = useForm({
  validationSchema: schema
});

const [user, userAttrs] = defineField('user');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const submitForm = async () => {
  const result = await validate();

  if (!result.valid) {
    console.log("Errores en el formulario:", errors);
    return;
  }
};
</script>

<style scoped>
.user-profile {
  height: 100vh;
  @media(max-width: 991px){
    height: 100%;
  }
}

.content {
  height: 100%;
}

.container {
  height: 100%;
}

span {
  font-weight: 600;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 40px;
  @media(max-width: 991px){
    gap: 100px;
    padding: 40px 0;
  }
}

.image {
  z-index: 1;
}

.robot {
  width: 170px;

  @media(max-width: 576px){
    width: 240px;
  }
}

/* .bg-info {
  background-color: black;
  border-radius: 0% 59% 57% 52% / 95% 138% 57% 0%;
  overflow: hidden;
  width: 47%;
  height: 100%;
  position: absolute;
  top: 0;
  @media(max-width: 991px){
    background-color: black;
    border-radius: 0% 0% 50% 50% / 85% 88% 12% 15%;
    overflow: hidden;
    width: 100%;
    height: 440px;
    position: absolute;
    top: 0;
  }
  @media(max-width: 576px){
    height: 400px;
  }
} */

.profile-details {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
