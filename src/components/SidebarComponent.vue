<template>
  <div :class="['sidebar', { 'sidebar--expanded': isExpanded }]">
    <div class="sidebar-header">
      <img class="robot" src="../assets/images/login/image1.png" alt="Robot">
      <h1 class="title">GameNest</h1>
      <button @click="toggleSidebar" class="toggle-button">
        {{ isExpanded ? 'Cerrar' : 'Abrir' }}
      </button>
    </div>
    <div class="sidebar-search">
      <input type="text" placeholder="Buscar..." v-model="searchQuery" />
    </div>
    <div class="sidebar-categories">
      <h2>Categorías</h2>
      <ul>
        <li><i class="icon icon-game"></i> Todo</li>
        <li><i class="icon icon-experience"></i> Experiencias</li>
        <li><i class="icon icon-knowledge"></i> Conocimientos</li>
        <li><i class="icon icon-entertainment"></i> Entretenimiento</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isExpanded = ref(false);
const searchQuery = ref('');

const emit = defineEmits(['toggle']);

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
  emit('toggle', isExpanded.value);
};
</script>

<style scoped>
.sidebar {
  background-color: black;
  color: white;
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.sidebar--expanded {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 20px;
}

.robot {
  width: 50px;
  margin-right: 10px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.toggle-button {
  margin-left: auto;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.sidebar-search {
  padding: 20px;
}

.sidebar-search input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
}

.sidebar-categories {
  padding: 20px;
}

.sidebar-categories h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.sidebar-categories ul {
  list-style: none;
  padding: 0;
}

.sidebar-categories li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.icon {
  margin-right: 10px;
}

/* Add your own icon classes here */
.icon-game::before {
  content: '🎮';
}

.icon-experience::before {
  content: '🕹️';
}

.icon-knowledge::before {
  content: '📚';
}

.icon-entertainment::before {
  content: '🎬';
}
</style>
