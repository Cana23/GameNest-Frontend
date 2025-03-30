<template>
  <layoutComponent/>
   <tablesComponent
   :users="userStore.admins"
   :loading="loading"
   :error="error"
   :key="AdminComponentKey"/>
</template>

<script lang="ts" setup>
import layoutComponent from '@/components/layoutComponent.vue';
import { useAdminStore } from '@/stores/adminStore';
import { ref, onMounted, watch, type Ref } from 'vue';
import { useRoute } from "vue-router";
import TablesComponent from "@/components/admin/TablesComponent.vue";

const route = useRoute();
const userStore = useAdminStore();
const { loading, error } = userStore;
const AdminComponentKey = ref(0);

onMounted(() => {
 userStore.fetchAdmins();
});

watch(route, () => {
  userStore.fetchAdmins();
  AdminComponentKey.value++;
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
