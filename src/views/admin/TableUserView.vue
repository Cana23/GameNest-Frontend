<template>
   <layoutComponent/>
   <section class="my-7">
    <div class="container">
        <h1>Usuarios</h1>
    </div>
    </section>
   <TablesComponent
   :users="userStore.users"
   :loading="loading"
   :error="error"
   :key="userComponentKey"/>
</template>

<script lang="ts" setup>
import layoutComponent from '@/components/layoutComponent.vue';
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted, watch, type Ref } from 'vue';
import { useRoute } from "vue-router";
import TablesComponent from "@/components/admin/TablesComponent.vue";

const userStore = useUserStore();
const { loading, error } = userStore;
const userComponentKey = ref(0);


const route = useRoute();

onMounted(() => {
  userStore.fetchUsers();
});


watch(route, () => {
  userStore.fetchUsers();
  userComponentKey.value++;
});
</script>

<style scoped>
.bg-gradient-to-b {
  padding: 10px;
  text-align: left;
}
section{
  padding-left: 256px;
}
</style>
