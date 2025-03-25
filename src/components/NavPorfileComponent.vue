<template>
  <section>
    <div class='container'>
      <div class="porfile mr-8 mt-8 fixed right-0 top-0 z-10" v-if="isAuthenticated">
        <!-- <div class="logo-container">
          <img src="../assets/images/login/image1.png" alt="GameNest Logo" class="logo">
          <router-link to="/home" class="title-link">
            <span class="title text-gray-600">GameNest</span>
          </router-link>
        </div> -->
        <p class="text-gray-600 font-semibold">{{ username }}</p>
        <button @click="toggle">
          <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
        </button>
        <Popover ref="op">
          <div class="flex flex-col gap-4">
            <div>
              <ul class="list-none p-0 m-0 flex flex-col">
                <router-link to="/user-profile" class="flex items-center gap-2 px-4 py-3 hover:bg-gray-200 cursor-pointer rounded-border">
                  <span class="font-medium">Mi perfil</span>
                </router-link>
                <li class="flex items-center gap-2 px-4 py-3 hover:bg-gray-200 cursor-pointer rounded-border" @click="visible = true">
                  <div>
                    <span class="font-medium">Cerrar sesión</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  </section>
  <Dialog :draggable="false" v-model:visible="visible" modal header="Cerrar sesión" :style="{ width: '25rem', backgroundColor:'white', color: 'gray', padding: '10px 20px' }">
    <p class="text-gray-600">¿Estás seguro de que deseas cerrar la sesión?</p>
    <div class="flex justify-end gap-4">
      <button type="button" @click="handleLogout" class="py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-700 cursor-pointer">Sí</button>
      <button type="button" @click="visible = false" class="py-2 px-4 text-purple-600 rounded-xl hover:bg-purple-200 cursor-pointer">No</button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();
const visible = ref(false);
const op = ref();

const isAuthenticated = computed(() => !!authStore.token);
const username = computed(() => authStore.user?.userName || "Usuario");
console.log(username)

const toggle = (event: any) => {
  op.value.toggle(event);
};

const handleLogout = () => {
  authStore.logout();
  visible.value = false;
  router.push({ name: "login" });
};
</script>

<style scoped>
.porfile {
  display: flex;
  align-items: center;
  gap: 20px;
  top: 0;
  z-index: 10;
  background-color: white;
  padding: 10px 20px;
}

.porfile img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  height: 40px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.title-link {
  text-decoration: none;
  color: inherit;
}

.container {
  padding-top: 80px;
}
</style>
