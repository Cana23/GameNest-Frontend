<template>
  <layoutComponent />
  <section class="user-profile">
    <div class="container">
      <div class="content">
        <div class="image flex flex-col justify-center items-center">
          <img class="robot" src="../assets/images/login/image1.png" alt="" />
          <h1 class="text-white text-center max-w-100 font-semibold">
            Perfil de Usuario
          </h1>
        </div>
        <div class="profile-details flex flex-col justify-center items-center">
          <div class="mb-8">
            <p class="text-center text-gray-600">
              Aquí puedes ver y editar la información de tu perfil.
            </p>
          </div>
          <div class="w-full max-w-md">
            <!-- Formulario para editar perfil -->
            <form @submit.prevent="submitForm">
              <div class="flex flex-col gap-8">
                <div class="relative">
                  <FloatLabel variant="on" class="bg-white">
                    <InputText
                      id="userName"
                      v-model="userName"
                      required
                      :class="{
                        'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true,
                        'border-red-500': errors.userName,
                      }"
                    />
                    <label for="userName" class="bg-white">Nombre de usuario</label>
                  </FloatLabel>
                  <span
                    v-if="errors.userName"
                    class="text-red-500 absolute"
                    style="font-size: 12px; padding-left: 20px;"
                  >
                    * {{ errors.userName }}
                  </span>
                </div>
                <div class="relative">
                  <FloatLabel variant="on" class="bg-white">
                    <InputText
                      id="email"
                      v-model="email"
                      required
                      :class="{
                        'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true,
                        'border-red-500': errors.email,
                      }"
                    />
                    <label for="email" class="bg-white">Correo electrónico</label>
                  </FloatLabel>
                  <span
                    v-if="errors.email"
                    class="text-red-500 absolute"
                    style="font-size: 12px; padding-left: 20px;"
                  >
                    * {{ errors.email }}
                  </span>
                </div>
                <Button
                  type="submit"
                  label="Guardar Cambios"
                  severity="help"
                  class="bg-purple-500 py-3 px-8 rounded-3xl text-white font-bold hover:bg-purple-800"
                  :disabled="isSubmitting"
                />
                <div v-if="showSuccess" class="text-green-500 text-center py-2">
                  ¡Perfil actualizado correctamente!
                </div>
                <div v-if="showError" class="text-red-500 text-center py-2">
                  Error al actualizar el perfil
                </div>
              </div>
            </form>

            <!-- Formulario para cambiar contraseña -->
            <div class="mt-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Cambiar contraseña
              </h2>
              <form @submit.prevent="changeUserPassword">
                <div class="mb-4 relative">
                  <label
                    for="currentPassword"
                    class="block text-gray-700 font-medium mb-2"
                  >
                    Contraseña actual
                  </label>
                  <input
                    :type="showCurrentPassword ? 'text' : 'password'"
                    v-model="currentPassword"
                    id="currentPassword"
                    class="w-full border border-gray-300 rounded p-2"
                    placeholder="Ingresa tu contraseña actual"
                    required
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    @click="toggleShowCurrentPassword"
                  >
                    <i :class="showCurrentPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                  </button>
                </div>
                <div class="mb-4 relative">
                  <label
                    for="newPassword"
                    class="block text-gray-700 font-medium mb-2"
                  >
                    Nueva contraseña
                  </label>
                  <input
                    :type="showNewPassword ? 'text' : 'password'"
                    v-model="newPassword"
                    id="newPassword"
                    class="w-full border border-gray-300 rounded p-2"
                    placeholder="Ingresa tu nueva contraseña"
                    required
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    @click="toggleShowNewPassword"
                  >
                    <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                  </button>
                </div>
                <button
                  type="submit"
                  class="bg-purple-500 py-3 px-8 rounded-3xl text-white font-bold hover:bg-purple-800"
                >
                  Cambiar contraseña
                </button>
              </form>
              <div v-if="passwordSuccess" class="text-green-500 text-center py-2">
                ¡Contraseña cambiada exitosamente!
              </div>
              <div v-if="passwordError" class="text-red-500 text-center py-2">
                Error al cambiar la contraseña
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import NavPorfileComponent from "@/components/NavPorfileComponent.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import UserService from "@/services/UserEditService";
import ProfileService from "@/services/ProfileService"; // Importar el servicio para cambiar contraseña
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { computed, watch } from "vue";
import layoutComponent from "@/components/layoutComponent.vue";

const router = useRouter();
const authStore = useAuthStore();
const isSubmitting = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const passwordSuccess = ref(false);
const passwordError = ref(false);
const currentPassword = ref<string>(""); // Contraseña actual
const newPassword = ref<string>(""); // Nueva contraseña
const showCurrentPassword = ref(false); // Mostrar u ocultar la contraseña actual
const showNewPassword = ref(false); // Mostrar u ocultar la nueva contraseña
const currentUserId = ref("");

// Funciones para alternar la visibilidad de las contraseñas
const toggleShowCurrentPassword = () => {
  showCurrentPassword.value = !showCurrentPassword.value;
};

const toggleShowNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};

// Redirigir al login si el usuario no está autenticado
const isAuthenticated = computed(() => !!authStore.token);
watch(isAuthenticated, (newValue) => {
  if (!newValue) {
    router.push({ name: "login" });
  }
});

// Esquema de validación
const validationSchema = yup.object({
  userName: yup.string().required("El nombre de usuario es requerido"),
  email: yup
    .string()
    .required("El correo es requerido")
    .email("Ingresa un correo válido"),
});

// Configuración de vee-validate
const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: userName } = useField("userName");
const { value: email } = useField("email");

// Cargar datos del usuario
const loadUserData = async () => {
  try {
    if (!authStore.isAuthenticated || !authStore.user) {
      router.push({ name: "login" });
      return;
    }

    const userData = await UserService.getCurrentUser();
    userName.value = userData.userName;
    email.value = userData.email;

    if (authStore.user) {
      currentUserId.value = authStore.user.id.toString();
    }
  } catch (error) {
    console.error("Error al cargar datos del usuario:", error);
    showError.value = true;
    setTimeout(() => (showError.value = false), 3000);
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
        email: values.email,
      });

      if (authStore.user) {
        authStore.user.userName = values.userName;
        authStore.user.email = values.email;
        localStorage.setItem("user", JSON.stringify(authStore.user));
      }

      showSuccess.value = true;
      setTimeout(() => (showSuccess.value = false), 3000);
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    showError.value = true;
    setTimeout(() => (showError.value = false), 3000);
  } finally {
    isSubmitting.value = false;
  }
});

// Cambiar contraseña
const changeUserPassword = async () => {
  try {
    if (!currentPassword.value || !newPassword.value) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const message = await ProfileService.changePassword(
      currentPassword.value,
      newPassword.value
    );
    console.log(message);
    passwordSuccess.value = true;
    setTimeout(() => (passwordSuccess.value = false), 3000);

    currentPassword.value = "";
    newPassword.value = "";
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    passwordError.value = true;
    setTimeout(() => (passwordError.value = false), 3000);
  }
};

// Cargar datos cuando el componente se monta
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push({ name: "login" });
  } else {
    loadUserData();
  }
});
</script>

<style scoped>
section{
  padding-left: 335px;
}
.user-profile {
  /* height: 100vh; */

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
