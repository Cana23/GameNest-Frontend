<template>
    <LayoutComponent />
    <section class="m-section-new">
        <!-- Seccion 1 -->
            <div class="container">
                <div class="content">
                    <div class="relative search-input">
                        <input v-model="searchQuery" type="text"
                            placeholder="Buscar publicaciones por título o contenido..."
                            class="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            @input="handleSearch" />
                        <!-- <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div> -->
                    </div>
                </div>
            </div>
        <!-- Seccion 2 -->
            <!-- Estado de carga -->
            <div v-if="loading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>

            <!-- Mensaje cuando no hay resultados -->
            <div v-else-if="filteredPublications.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
                <p class="text-gray-500 text-lg">
                    {{ searchQuery ? 'No se encontraron publicaciones que coincidan con tu búsqueda' : 'No hay publicaciones para mostrar' }}
                </p>
            </div>

            <!-- Listado de publicaciones -->
            <div v-else class="space-y-6">
                <div v-for="publication in filteredPublications" :key="publication.id">
                    <CardPublications :post="publication" />
                </div>
            </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import PublicationsService from '@/services/PublicationService';
import type { Publication } from '@/interfaces/PublicationInterface';
import LayoutComponent from '@/components/layoutComponent.vue';
import CardPublications from '@/components/CardPublications.vue';

const searchQuery = ref('');
const allPublications = ref<Publication[]>([]);
const loading = ref(true);
const error = ref('');


// Obtener todas las publicaciones al cargar el componente
// onMounted(async () => {
//     try {
//         loading.value = true;
//         allPublications.value = await PublicationsService.getAllPublications();
//     } catch (err) {
//         console.error('Error al cargar publicaciones:', err);
//         error.value = 'Error al cargar publicaciones. Por favor, intenta nuevamente.';
//     } finally {
//         loading.value = false;
//     }
// });
onMounted(async () => {
    try {
        loading.value = true;
        allPublications.value = await PublicationsService.getAllPublications();
        console.log("Publicaciones cargadas:", allPublications.value);
    } catch (err) {
        console.error('Error al cargar publicaciones:', err);
        error.value = 'Error al cargar publicaciones. Por favor, intenta nuevamente.';
    } finally {
        loading.value = false;
    }
});


// Filtrar publicaciones según búsqueda
const filteredPublications = computed(() => {
    let results = allPublications.value;

    // Filtrar por texto de búsqueda
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        results = results.filter(pub =>
            pub.title.toLowerCase().includes(query) ||
            pub.content.toLowerCase().includes(query)
        )
    }



    // Ordenar por fecha más reciente primero
    return results.sort((a, b) =>
        new Date(b.publicationDate || 0).getTime() - new Date(a.publicationDate || 0).getTime()
    );
});

// Manejar búsqueda con debounce (mejorar rendimiento)
let searchTimeout: number;
const handleSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        // La propiedad computed filteredPublications se actualizará automáticamente
    }, 300);
};
</script>

<style scoped>
section{
  padding-left: 168px;
}
.search-input {
    padding-left: 166px;
}
</style>
