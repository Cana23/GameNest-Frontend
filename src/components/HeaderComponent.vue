<template>
  <header class="header">
    <div class="container">
      <div class="logo-container">
        <img src="../assets/images/login/image1.png" alt="GameNest Logo" class="logo">
        <router-link to="/home" class="title-link">
          <span class="title">GameNest</span>
        </router-link>
      </div>
      <div class="user-menu" v-if="isAuthenticated">
        <span class="welcome-text">¡Bienvenido usuario!</span>
        <button @click="toggleMenu" class="user-icon">
          <Avatar icon="pi pi-user" shape="circle" class="user-avatar" />
        </button>
        <div v-if="isMenuOpen" class="dropdown-menu">
          <router-link to="/user-profile" class="dropdown-item">Perfil</router-link>
          <button @click="handleLogout" class="dropdown-item">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Avatar from 'primevue/avatar';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const isMenuOpen = ref(false);

const isAuthenticated = computed(() => !!authStore.token);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleLogout = () => {
  authStore.logout(); // Llama al método logout del store
  router.push({ name: 'Login' });
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
  position: relative;
}

.welcome-text {
  margin-right: 10px;
  font-size: 14px;
  font-weight: bold;
}

.user-icon {
  background: none;
  border: none;
  cursor: pointer;
}

.user-avatar {
  width: 35px;
  height: 35px;
  background-color: #ffffff33;
  color: white;
}

.dropdown-menu {
  position: absolute;
  top: 45px; /* Ajusta la posición para que el menú se despliegue hacia abajo */
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
  padding: 5px 0;
}

.dropdown-item {
  display: block;
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
</style>
