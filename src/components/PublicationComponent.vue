<template>
    <div class="bg-white rounded-lg shadow-md p-4">
        <!-- Usuario -->
        <div class="flex items-center space-x-2 mb-2">
            <img src="https://ui-avatars.com/api/?name={{ post.userName }}" alt="Avatar"
                class="w-10 h-10 rounded-full" />
            <p class="font-semibold text-gray-700">{{ post.userName }}</p>
        </div>

        <!-- Imagen -->
        <div v-if="post.imageUrl" class="mb-4">
            <img :src="post.imageUrl" alt="Imagen de la publicación" class="w-full rounded-lg" />
        </div>

        <!-- Título -->
        <h3 class="text-lg font-bold text-gray-900 mb-1">{{ post.title }}</h3>

        <!-- Contenido -->
        <p class="text-gray-700 mb-4">{{ post.content }}</p>

        <!-- Like -->
        <div class="flex items-center">
            <button class="text-blue-500 hover:text-blue-700 font-semibold">
                ❤️ Me gusta ({{ post.likes.length }})
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Publication } from '@/services/PublicationService';

defineProps<{
    post: Publication;
}>();
</script>
