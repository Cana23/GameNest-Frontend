<template>
  <section class="">
    <div class="bg-info"></div>
    <div class="container">
      <div class="content">
        <div class="image flex flex-col justify-center items-center">
          <img class="robot" src="../assets/images/login/image1.png" alt="Robot">
          <p class="text-white text-center max-w-100">
            Explora y comparte tus experiencias en el mundo del desarrollo de videojuegos con
            <span class="font-semibold">GameNest</span>.
          </p>
        </div>
        <div class="form-login flex flex-col justify-center items-center">
          <div class="mb-8">
            <h1 class="font-semibold mb-4 text-center">Regístrate</h1>
            <p class="text-center text-gray-600">
              Bienvenido, no te pierdas esta aventura y sumérgete en la experiencia.
            </p>

            <div v-if="backendErrors.length > 0" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <ul class="list-disc pl-5">
                <li v-for="(error, index) in backendErrors" :key="index">{{ error }}</li>
              </ul>
            </div>
          </div>
          <form @submit.prevent="submitForm" novalidate class="w-full">
            <div class="flex flex-col gap-8">
              <div class="relative">
                <FloatLabel variant="on" class="bg-white">
                  <InputText id="username" v-model="user" required
                    :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.user }" />
                  <label for="username" class="bg-white">Nombre</label>
                </FloatLabel>
                <span v-if="errors.user" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{ errors.user }}</span>
              </div>
              <div class="relative">
                <FloatLabel variant="on" class="bg-white">
                  <InputText id="email" v-model="email" required
                    :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.email }" />
                  <label for="email" class="bg-white">Correo</label>
                </FloatLabel>
                <span v-if="errors.email" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{ errors.email }}</span>
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

              <Button
                label="Registrarse"
                severity="help"
                type="submit"
                class="bg-purple-500 py-3 px-8 rounded-3xl text-white font-bold hover:bg-purple-800"
              />
            </div>
          </form>
          <p class="text-center text-gray-600 mt-5">
            Ya tienes cuenta
            <RouterLink to="/login" class="text-purple-500 font-semibold">Inicia sesión</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

// Expresión regular para validar contraseñas
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?¡¿/\\|`~'"]).{6,}$/;

// Esquema de validación
const schema = yup.object({
  user: yup.string().required('El Nombre es requerido'),
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

const [user, userAttrs] = defineField('user');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');

const authStore = useAuthStore();
const router = useRouter();

const backendErrors = ref<string[]>([]);

const submitForm = async () => {
  const result = await validate();

  if (!result.valid) {
    console.log("Errores en el formulario:", errors);
    backendErrors.value = [];
    return;
  }

  console.log("Formulario válido. Enviando datos...");

  const registerData:any = {
    UserName: user.value,
    Email: email.value,
    Password: password.value,
  };

  try {
    console.log("Datos enviados:", registerData);
    const registrationResult = await authStore.registerUser(registerData);
    if (registrationResult === true) {
      console.log("Registro exitoso. Redirigiendo a /home...");
      router.push({ name: 'Home User' });
    } else if (Array.isArray(registrationResult)) {
      backendErrors.value = registrationResult;
      console.log("Errores del backend:", backendErrors.value);
    } else {
      backendErrors.value = ["Error al registrar el usuario. Inténtalo de nuevo."];
      console.log("Registro fallido (error genérico del store).");
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    backendErrors.value = [error.message || "Ocurrió un error inesperado."];
  }
};
</script>

<style scoped>
section {
  height: 100vh;
  @media (max-width: 991px) {
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  @media (max-width: 991px) {
    display: flex;
    flex-direction: column;
    gap: 100px;
    padding: 40px 0;
  }
}
.image {
  z-index: 1;
}
.robot {
  width: 300px;

  @media (max-width: 576px) {
    width: 240px;
  }
}
.bg-info {
  background-color: black;
  border-radius: 0% 59% 57% 52% / 95% 138% 57% 0%;
  overflow: hidden;
  width: 47%;
  height: 100%;
  position: absolute;
  top: 0;
  @media (max-width: 991px) {
    background-color: black;
    border-radius: 0% 0% 50% 50% / 85% 88% 12% 15%;
    overflow: hidden;
    width: 100%;
    height: 440px;
    position: absolute;
    top: 0;
  }
  @media (max-width: 576px) {
    height: 400px;
  }
}
</style>
