<template>
  <header class="header">
    <div class="container">
      <div class="logo-container">
        <img src="../assets/images/login/image1.png" alt="GameNest Logo" class="logo">
        <span class="title">GameNest</span>
      </div>
      <div class="user-menu">
        <button @click="redirectToLogin" class="login-button">Inicia sesión</button>
        <button @click="redirectToRegister" class="register-button">Regístrate</button>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const redirectToLogin = () => {
  router.push('/login');
};

const redirectToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.header {
  background-color: #2c3e50;
  color: white;
  padding: 10px 0;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
}

.user-menu {
  display: flex;
  align-items: center;
}

.login-button {
  border: 1px solid #9b59b6;
  color: #d6a6e9;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.login-button:hover {
  background-color: #9b59b6;
  color: white;
}

.register-button {
  background-color: #9b59b6;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.register-button:hover {
  background-color: #8e44ad;
}
</style>
