<template>
  <div>
    <nav
      class="fixed top-0 left-0 w-full flex items-center justify-between p-4 transition-all duration-300"
      :class="isExpanded ? 'h-20' : 'h-16'"
      ref="navbar"
    >
      <div class="flex items-center">
        <img src="../assets/images/login/image1.png" alt="GameNest Logo" class="logo">
        <router-link to="/home" class="title-link">
          <span class="title">GameNest</span>
        </router-link>
      </div>

      <div class="flex items-center gap-6">
        <p class="text-white font-semibold text-lg">{{ username }}</p>
        <button @click="toggle">
          <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
        </button>
      </div>

      <Popover ref="op">
        <div class="flex flex-col gap-4 bg-white rounded-lg p-4 shadow-lg">
          <router-link to="/user-profile" class="menu-item">
            <i class="pi pi-user-edit"></i>
            <span>Editar perfil</span>
          </router-link>
          <button @click="visible = true" class="menu-item">
            <i class="pi pi-sign-out"></i>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </Popover>
    </nav>

    <div :style="{ marginTop: navbarHeight + 'px' }"></div>

    <Dialog
      v-model:visible="visible"
      modal header="Cerrar sesión"
      :style="{ width: '400px' }"
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    >
      <div class="p-4">
        <p class="text-gray-300 mb-4">¿Estás seguro de que deseas cerrar la sesión?</p>
        <div class="flex justify-end gap-4">
          <button @click="handleLogout" class="btn-danger">Sí</button>
          <button @click="visible = false" class="btn-cancel">No</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();
const visible = ref(false);
const op = ref();
const navbar = ref<HTMLElement | null>(null);
const navbarHeight = ref(0);

const isAuthenticated = computed(() => !!authStore.token);
const username = computed(() => authStore.user?.userName || "Usuario");

const toggle = (event: any) => {
  op.value.toggle(event);
};

const handleLogout = () => {
  authStore.logout();
  visible.value = false;
  router.push({ name: "login" });
};

const updateNavbarHeight = () => {
  nextTick(() => {
    if (navbar.value) {
      navbarHeight.value = navbar.value.offsetHeight;
    }
  });
};

onMounted(() => {
  updateNavbarHeight();
  window.addEventListener("resize", updateNavbarHeight);
});
</script>

<style scoped>
nav {
  background: linear-gradient(to right, #1e293b, #2563eb);
  z-index: 50;
  padding: 10px 20px;
  display: flex;
  align-items: center;
}

.logo {
  height: 50px;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: white;
}

.title-link {
  text-decoration: none;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 6px;
  transition: all 0.3s;
}

.menu-item:hover {
  background-color: #f3f4f6;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.btn-cancel {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #2563eb;
}
</style>
