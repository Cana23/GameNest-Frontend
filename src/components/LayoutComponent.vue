<template>
  <div class="layout">
    <HeaderComponent />
    <main class="main-content">
      <slot></slot>
    </main>
    <FooterComponent />
  </div>
</template>

<script lang="ts" setup>
import HeaderComponent from './HeaderComponent.vue';
import FooterComponent from './FooterComponent.vue';
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
