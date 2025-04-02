<template>
    <LayoutAdmin>
        <template #default>
            <h1 class="text-2xl font-semibold mb-4">Registros del Sistema</h1>

            <!-- Filtros -->
            <div class="mb-4 flex gap-4">
                <!-- Filtro por tipo de log -->
                <select v-model="logTypeFilter" class="text-black p-2 border rounded">
                    <option value="">Filtrar por tipo de log</option>
                    <option value="Information">Information</option>
                    <option value="Warning">Warning</option>
                    <option value="Error">Error</option>
                    <option value="Critical">Critical</option>
                </select>

                <!-- Filtro por orden de fecha -->
                <select v-model="dateOrderFilter" class="text-black p-2 border rounded">
                    <option value="desc">Fecha más reciente</option>
                    <option value="asc">Fecha más antigua</option>
                </select>
            </div>

            <!-- Tabla de logs -->
            <div class="bg-white shadow rounded p-4 max-h-[70vh] overflow-y-auto">
                <table class="min-w-full">
                    <thead>
                        <tr class="bg-gray-200 text-left text-black font-bold">
                            <th class="p-3">Fecha</th>
                            <th class="p-3">Tipo de Log</th>
                            <th class="p-3">Contenido del Log</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(log, index) in filteredLogs" :key="index"
                            class="border-b hover:bg-gray-100 text-black">
                            <td class="p-3">{{ log.date }}</td>
                            <td class="p-3">
                                <span :class="{
                                    'bg-green-500': log.type === 'Information',
                                    'bg-yellow-500': log.type === 'Warning',
                                    'bg-red-500': log.type === 'Error'
                                }" class="px-2 py-1 rounded text-white text-sm">{{ log.type }}</span>
                            </td>
                            <td class="p-3">{{ log.message }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </LayoutAdmin>
</template>


<script setup lang="ts">
import LayoutAdmin from "@/layouts/LayoutAdmin.vue";
import { ref, onMounted, computed } from "vue";
import { obtenerLogs } from "@/services/admin/logsAdminService";

interface Log {
    date: string;
    type: string;
    message: string;
}

const logs = ref<string[]>([]);
const processedLogs = ref<Log[]>([]);

// Filtros
const logTypeFilter = ref("");    // Filtro para el tipo de log
const dateOrderFilter = ref("desc"); // Filtro para la fecha

onMounted(async () => {
    try {
        logs.value = await obtenerLogs();
        // Verificamos que logs.value sea un arreglo antes de procesarlo
        if (Array.isArray(logs.value)) {
            processedLogs.value = logs.value.map(log => processLog(log));
        } else {
            console.error("La respuesta no es un arreglo");
        }
    } catch (error) {
        console.error("Error al obtener logs:", error);
    }
});

// Función para procesar cada log
const processLog = (log: string): Log => {
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} -\d{2}:\d{2}/;  // Extrae la fecha
    const typeRegex = /\[(Information|Warning|Error|Critical)\]/;  // Extrae el tipo de log (Information, Warning, Error)

    const date = log.match(dateRegex)?.[0] ?? 'Desconocida';
    const type = log.match(typeRegex)?.[1] ?? 'Unknown';
    const message = log.replace(date, '').replace(type, '').trim();  // El resto es el mensaje

    return { date, type, message };
};

// Computed para filtrar y ordenar los logs
const filteredLogs = computed(() => {
    let filtered = processedLogs.value;

    // Filtro por tipo de log
    if (logTypeFilter.value) {
        filtered = filtered.filter(log => log.type === logTypeFilter.value);
    }

    // Filtro y orden por fecha
    if (dateOrderFilter.value === "asc") {
        filtered = filtered.sort((a, b) => new Date(a.date) > new Date(b.date) ? 1 : -1);
    } else {
        filtered = filtered.sort((a, b) => new Date(a.date) < new Date(b.date) ? 1 : -1);
    }

    return filtered;
});
</script>

