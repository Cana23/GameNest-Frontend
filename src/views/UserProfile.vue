<template>
  <layoutComponent />
  <section class="user-profile">
    <div class="container">
      <div class="content">
        <div class="profile-header">
          <div class="image flex flex-col justify-center items-center">
            <img class="robot" src="../assets/images/login/image1.png" alt="Avatar" />
            <h1 class="text-neon-light text-center font-semibold text-2xl">
              Perfil de {{ userName }}
            </h1>
            <p class="text-neon-gray mt-2">
              Administra tu información personal y seguridad
            </p>
          </div>
        </div>

        <div class="profile-grid">
          <!-- Columna izquierda - Información del usuario -->
          <div class="profile-card">
            <h2 class="section-title">
              <i class="pi pi-user mr-2"></i> Información Personal
            </h2>

            <form @submit.prevent="submitForm" class="mt-6">
              <div class="form-group">
                <FloatLabel variant="on" class="bg-neon-dark">
                  <InputText
                    id="userName"
                    v-model="userName"
                    required
                    class="w-full py-3 px-4 border-1 border-neon-border rounded-lg bg-neon-dark text-neon-light"
                  />
                  <label for="userName" class="text-neon-gray">Nombre de usuario</label>
                </FloatLabel>
                <span v-if="errors.userName" class="text-neon-red text-sm mt-1">
                  * {{ errors.userName }}
                </span>
              </div>

              <div class="form-group mt-4">
                <FloatLabel variant="on" class="bg-neon-dark">
                  <InputText
                    id="email"
                    v-model="email"
                    required
                    class="w-full py-3 px-4 border-1 border-neon-border rounded-lg bg-neon-dark text-neon-light"
                  />
                  <label for="email" class="text-neon-gray">Correo electrónico</label>
                </FloatLabel>
                <span v-if="errors.email" class="text-neon-red text-sm mt-1">
                  * {{ errors.email }}
                </span>
              </div>

              <Button
                type="submit"
                label="Guardar Cambios"
                class="mt-6 bg-gradient-to-r from-neon-purple to-neon-blue text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity w-full"
                :disabled="isSubmitting"
              />

              <div v-if="showSuccess" class="text-neon-green text-center py-3 mt-4">
                <i class="pi pi-check-circle mr-2"></i> ¡Perfil actualizado correctamente!
              </div>
              <div v-if="showError" class="text-neon-red text-center py-3 mt-4">
                <i class="pi pi-exclamation-triangle mr-2"></i> Error al actualizar el perfil
              </div>
            </form>
          </div>

          <!-- Columna derecha - Cambio de contraseña -->
          <div class="profile-card">
            <h2 class="section-title">
              <i class="pi pi-lock mr-2"></i> Seguridad y Contraseña
            </h2>

            <form @submit.prevent="changeUserPassword" class="mt-6">
              <div class="form-group relative">
                <FloatLabel variant="on" class="bg-neon-dark">
                  <Password
                    id="currentPassword"
                    v-model="currentPassword"
                    :feedback="false"
                    toggleMask
                    inputClass="w-full py-3 px-4 border-1 border-neon-border rounded-lg bg-neon-dark text-neon-light"
                  />
                  <label for="currentPassword" class="text-neon-gray">Contraseña actual</label>
                </FloatLabel>
              </div>

              <div class="form-group relative mt-4">
                <FloatLabel variant="on" class="bg-neon-dark">
                  <Password
                    id="newPassword"
                    v-model="newPassword"
                    :feedback="false"
                    toggleMask
                    inputClass="w-full py-3 px-4 border-1 border-neon-border rounded-lg bg-neon-dark text-neon-light"
                  />
                  <label for="newPassword" class="text-neon-gray">Nueva contraseña</label>
                </FloatLabel>
              </div>

              <Button
                type="submit"
                label="Cambiar Contraseña"
                class="mt-6 bg-gradient-to-r from-neon-purple to-neon-blue text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity w-full"
              />

              <div v-if="passwordSuccess" class="text-neon-green text-center py-3 mt-4">
                <i class="pi pi-check-circle mr-2"></i> ¡Contraseña cambiada exitosamente!
              </div>
              <div v-if="passwordError" class="text-neon-red text-center py-3 mt-4">
                <i class="pi pi-exclamation-triangle mr-2"></i> Error al cambiar la contraseña
              </div>
            </form>
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
.user-profile {
  padding-left: 335px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f0c29, #1a1a2e);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.robot {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #6b46c1;
  box-shadow: 0 0 15px rgba(107, 70, 193, 0.5);
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.profile-card {
  background: linear-gradient(145deg, #1a1a2e, #2d1065);
  border: 1px solid #6b46c1;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(107, 70, 193, 0.3);
}

.section-title {
  color: #a78bfa;
  font-size: 1.25rem;
  font-weight: 600;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #6b46c1;
  display: flex;
  align-items: center;
}

.form-group {
  margin-bottom: 1rem;
}

/* Colores neón */
.text-neon-light {
  color: #f8fafc;
}

.text-neon-gray {
  color: #94a3b8;
}

.text-neon-red {
  color: #ef4444;
}

.text-neon-green {
  color: #10b981;
}

.bg-neon-dark {
  background-color: #1a1a2e;
}

.border-neon-border {
  border-color: #6b46c1;
}

.from-neon-purple {
  --tw-gradient-from: #4903c1;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(124, 58, 237, 0));
}

.to-neon-blue {
  --tw-gradient-to: #6455c2;
}

.hover\:opacity-90:hover {
  opacity: 0.9;
}

.transition-opacity {
  transition: opacity 0.2s ease;
}

@media (max-width: 768px) {
  .user-profile {
    padding-left: 0;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
