<script setup lang="ts">
import HeaderVisitante from '../components/HeaderVisitante.vue';
import FooterComponent from '../components/FooterComponent.vue';
</script>

<template>
    <div class="flex flex-col">
        <!-- Header fijo -->
        <HeaderVisitante />

        <!-- Contenido desplazable -->
        <main class="flex-1 overflow-y-auto mt-16">
            <slot />
        </main>
    </div>
    <!-- Footer -->
    <FooterComponent />
</template>