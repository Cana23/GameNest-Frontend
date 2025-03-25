<template>
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg text-center">
            <h1 class="font-black text-8xl text-transparent bg-clip-text bg-indigo-600 animate-pulse">
                404
            </h1>

            <p class="text-gray-700 text-lg">
                La ruta <span class="font-bold text-purple-600">{{ route.path }}</span> no existe.
            </p>

            <!-- Texto animado -->
            <p class="text-gray-600 text-sm">
                Regresando<span v-html="dots"></span>
            </p>

            <RouterLink :to="{ name: 'login' }" class="inline-block">
                <button
                    class="px-6 py-3 font-semibold text-white bg-purple-500 hover:bg-purple-800 rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out transform hover:-translate-y-1">
                    Regresar ahora
                </button>
            </RouterLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

// Hooks de Vue Router
const route = useRoute();
const router = useRouter();

// Animación de puntos
const dots = ref('.');
let dotInterval: number;

const animateDots = () => {
    let currentDots = '.';
    dotInterval = setInterval(() => {
        currentDots = currentDots === '...' ? '.' : currentDots + '.';
        dots.value = currentDots;
    }, 500);
};

setTimeout(() => {
    router.push({ name: 'login' });
}, 9000);

onMounted(() => {
    animateDots();
});

onUnmounted(() => {
    clearInterval(dotInterval);
});
</script>