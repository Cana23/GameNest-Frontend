<template>
  <NavPorfileComponent />
  <section class="user-profile">
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
            <form @submit.prevent="submitForm">
              <div class="flex flex-col gap-8">
                <div class="relative">
                  <FloatLabel variant="on" class="bg-white">
                    <InputText id="userName" v-model="userName" required
                      :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.userName }" />
                    <label for="userName" class="bg-white">Nombre de usuario</label>
                  </FloatLabel>
                  <span v-if="errors.userName" class="text-red-500 absolute"
                    style="font-size: 12px; padding-left: 20px;">* {{ errors.userName }}</span>
                </div>
                <div class="relative">
                  <FloatLabel variant="on" class="bg-white">
                    <InputText id="email" v-model="email" required
                      :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.email }" />
                    <label for="email" class="bg-white">Correo electrónico</label>
                  </FloatLabel>
                  <span v-if="errors.email" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">*
                    {{ errors.email }}</span>
                </div>
                <Button type="submit" label="Guardar Cambios" severity="help"
                  class="bg-purple-500 py-3 px-8 rounded-3xl text-white font-bold hover:bg-purple-800"
                  :disabled="isSubmitting" />
                <RouterLink to="/home" class="cursor-pointer">
                  <p class="text-lg text-center font-bold text-purple-500 hover:text-purple-700">← Volver a Inicio</p>
                </RouterLink>
                <div v-if="showSuccess" class="text-green-500 text-center py-2">
                  ¡Perfil actualizado correctamente!
                </div>
                <div v-if="showError" class="text-red-500 text-center py-2">
                  Error al actualizar el perfil
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import NavPorfileComponent from '@/components/NavPorfileComponent.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import UserService from '@/services/UserEditService';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { computed, watch } from 'vue';

const router = useRouter();
const authStore = useAuthStore();
const isSubmitting = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const currentUserId = ref('');

// Redirigir al login si el usuario no está autenticado
const isAuthenticated = computed(() => !!authStore.token);
watch(isAuthenticated, (newValue) => {
  if (!newValue) {
    router.push({ name: 'login' });
  }
});

// Esquema de validación
const validationSchema = yup.object({
  userName: yup.string().required('El nombre de usuario es requerido'),
  email: yup.string().required('El correo es requerido').email('Ingresa un correo válido')
});

// Configuración de vee-validate
const { handleSubmit, errors } = useForm({
  validationSchema
});

const { value: userName } = useField('userName');
const { value: email } = useField('email');

// Cargar datos del usuario
const loadUserData = async () => {
  try {
    // Verificar autenticación primero
    if (!authStore.isAuthenticated || !authStore.user) {
      router.push({ name: 'login' });
      return;
    }

    // Obtener datos del usuario
    const userData = await UserService.getCurrentUser();
    userName.value = userData.userName;
    email.value = userData.email;

    // Guardar el ID para futuras actualizaciones
    if (authStore.user) {
      currentUserId.value = authStore.user.id.toString();
    }
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
    showError.value = true;
    setTimeout(() => showError.value = false, 3000);
  }
};

// Manejar envío del formulario
const submitForm = handleSubmit(async (values) => {
  isSubmitting.value = true;
  showSuccess.value = false;
  showError.value = false;

  try {
    if (currentUserId.value) {
      await UserService.updateUser(currentUserId.value, {
        userName: values.userName,
        email: values.email
      });

      // Actualizar los datos en el store
      if (authStore.user) {
        authStore.user.userName = values.userName;
        authStore.user.email = values.email;
        localStorage.setItem('user', JSON.stringify(authStore.user));
      }

      showSuccess.value = true;
      setTimeout(() => showSuccess.value = false, 3000);
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    showError.value = true;
    setTimeout(() => showError.value = false, 3000);
  } finally {
    isSubmitting.value = false;
  }
});

// Cargar datos cuando el componente se monta
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' });
  } else {
    loadUserData();
  }
});
</script>


<style scoped>
.user-profile {
  height: 100vh;

  @media(max-width: 991px) {
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

  @media(max-width: 991px) {
    gap: 100px;
    padding: 40px 0;
  }
}

.image {
  z-index: 1;
}

.robot {
  width: 170px;

  @media(max-width: 576px) {
    width: 240px;
  }
}

.profile-details {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
