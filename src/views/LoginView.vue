<template>
  <section class="">
    <div class="bg-info"></div>
    <div class='container'>
      <div class='content'>
        <div class="image flex flex-col justify-center items-center">
          <img class="robot" src="../assets/images/login/image1.png" alt="">
          <p class="text-white text-center max-w-100">Explora y comparte tus experiencias en el mundo del desarrollo de videojuegos con <span class="font-semibold">GameNest</span>.</p>
        </div>
        <div class="form-login flex flex-col justify-center items-center">
          <div class="mb-8">
            <h1 class="font-semibold mb-4 text-center">Iniciar sesión</h1>
            <p class="text-center text-gray-600">Bienvenido, no te pierdas esta aventura y sumérgete en la experiencia.</p>

            <div v-if="loginError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {{ loginError }}
            </div>

          </div>
          <form @submit.prevent="submitForm" novalidate class="w-full">
            <div class="flex flex-col gap-8">
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

              <Button label="Iniciar sesión" severity="help" type="submit"
                class="bg-purple-500 py-3 px-8 rounded-3xl text-white font-bold hover:bg-purple-800" />
            </div>
          </form>
          <p class="text-center text-gray-600 mt-5">No tienes cuenta <RouterLink to="/register"
              class="text-purple-500 font-semibold">Registrate</RouterLink></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, RouterLink } from 'vue-router';
import { ref } from 'vue';
import adminService from "@/services/adminService";

const schema = yup.object({
  email: yup.string().email('Correo incorrecto').required('El correo es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
});

const { errors, defineField, validate } = useForm({
  validationSchema: schema
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const authStore = useAuthStore();
const router = useRouter();


const loginError = ref<string | null>(null);

const submitForm = async () => {
  const result = await validate();

  if (!result.valid) {
    console.log("Errores en el formulario:", errors);
    loginError.value = null;
    return;
  }

  const loginData = {
    email: email.value,
    password: password.value,
  };

  try {
    const loginResult = await authStore.loginUser(loginData);
    if (loginResult === true) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Verifica si el usuario tiene el rol de admin
      const admins = await adminService.getAllUseAdmin();
      const isAdmin = admins.some(admin => admin.email === user?.email);
      if (!isAdmin) {
        router.push({ name: 'Home User' }); // Redirige al home del usuario
      }
    } else if (typeof loginResult === 'string') {
      loginError.value = loginResult;
    } else {
      loginError.value = "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
    }
  } catch (error) {
    console.error("Error inesperado en el login:", error);
    loginError.value = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.";
  }
};
</script>


<style scoped>
section{
  height: 100vh;
  @media(max-width: 991px){
    height: 100%;
  }
}
.content{
  height: 100%;
}
.container{
  height: 100%;
}

span{
  font-weight: 600;
}
.content{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  @media(max-width: 991px){
    display: flex;
    flex-direction: column;
    gap: 100px;
    padding: 40px 0;
  }
}
.image{
  z-index: 1;
}
.robot{
  width: 300px;

  @media(max-width: 576px){
    width: 240px;
  }
}
.bg-info{
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

}
</style>
