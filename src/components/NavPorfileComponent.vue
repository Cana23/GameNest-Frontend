<template>
  <section class=''>
    <div class='container'>
      <div class="porfile mr-8 mt-6 fixed right-0 bg-white pl-12 py-2 rounded-2xl">
        <p class="text-gray-600 font-semibold">Usuario1</p>
        <button @click="toggle">
          <img src="../assets/images/gojo cat.jpg" alt="">
        </button>
        <Popover ref="op">
            <div class="flex flex-col gap-4">
                <div>
                    <ul class="list-none p-0 m-0 flex flex-col">
                      <li class="flex items-center gap-2 px-4 py-3 hover:bg-gray-200 cursor-pointer rounded-border" >
                            <div>
                                <span class="font-medium">Mi perfil</span>
                            </div>
                        </li>
                        <li class="flex items-center gap-2 px-4 py-3 hover:bg-gray-200 cursor-pointer rounded-border">
                            <div>
                                <span class="font-medium"><RouterLink to="/user-profile">Editar perfil</RouterLink> </span>
                            </div>
                        </li>
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
                <button type="button"@click="handleLogout" class="py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-700 cursor-pointer">Si</button>
                <button type="button" @click="visible = false" class="py-2 px-4 text-purple-600 rounded-xl hover:bg-purple-200 cursor-pointer">No</button>
            </div>
        </Dialog>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const visible = ref(false);

const op = ref();
const toggle = (event: any) => {
    op.value.toggle(event);
}

const handleLogout = () => {
  authStore.logout(); // Llama al método logout del store
  router.push({ name: 'login' });
};

</script>

<style scoped>
.porfile{
display: flex;
align-items: center;
gap: 20px;
img{
  width: 50px;
height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
}</style>
