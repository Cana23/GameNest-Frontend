<template>
    <LayoutAdmin>
        <template #default>
            <h1 class="text-2xl font-semibold mb-4">Registros del Sistema</h1>

            <!-- Filtros -->
            <div class="mb-4 flex gap-4">
                <select v-model="logTypeFilter" class="text-black p-2 border rounded">
                    <option value="">Filtrar por tipo de log</option>
                    <option value="Information">Information</option>
                    <option value="Warning">Warning</option>
                    <option value="Error">Error</option>
                    <option value="Critical">Critical</option>
                </select>

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
                            <th class="p-3">Método</th>
                            <th class="p-3">Ruta</th>
                            <th class="p-3">Estado</th>
                            <th class="p-3">Encabezados</th>
                            <th class="p-3">Respuesta</th>
                            <th class="p-3 text-center">Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(log, index) in filteredLogs" :key="index"
                            class="border-b hover:bg-gray-100 text-black">
                            <td class="p-3">{{ formatDate(log.timestamp) }}</td>
                            <td class="p-3">{{ log.method }}</td>
                            <td class="p-3">{{ log.path }}</td>
                            <td class="p-3">
                                <span :class="getStatusClass(log.statusCode)"
                                    class="px-2 py-1 rounded text-white text-sm">
                                    {{ log.statusCode }} ({{ getStatusType(log.statusCode) }})
                                </span>
                            </td>
                            <td class="p-3 truncate-text">{{ truncateText(log.headers, 50) }}</td>
                            <td class="p-3 truncate-text">{{ truncateText(log.responseData, 50) }}</td>
                            <td class="p-3 text-center">
                                <button @click="showModal(log)" class="text-blue-600 hover:text-blue-800">
                                    👁
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal -->
            <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div class="bg-white text-black p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto">
                    <div class="flex flex-row items-center justify-between mb-2 pb-2 border-b-2 border-slate-300">
                        <h2 class="text-xl font-semibold">Detalles del Log</h2>
                        <button @click="closeModal" class="bg-red-500 text-white px-4 py-2 rounded">Cerrar</button>
                    </div>
                    <p><strong>Fecha:</strong> {{ formatDate(selectedLog?.timestamp) }}</p>
                    <p><strong>Método:</strong> {{ selectedLog?.method }}</p>
                    <p><strong>Ruta:</strong> {{ selectedLog?.path }}</p>
                    <p><strong>Estado:</strong> {{ selectedLog?.statusCode }} ({{ getStatusType(selectedLog?.statusCode)
                        }})</p>

                    <p><strong>Encabezados:</strong></p>
                    <pre class="log-box">{{ selectedLog?.headers }}</pre>

                    <p><strong>Respuesta:</strong></p>
                    <pre class="log-box">{{ selectedLog?.responseData }}</pre>
                </div>
            </div>
        </template>
    </LayoutAdmin>
</template>

<script setup lang="ts">
import LayoutAdmin from "@/layouts/LayoutAdmin.vue";
import { ref, onMounted, computed } from "vue";
import { obtenerLogs } from "@/services/admin/logsAdminService";

interface Log {
    id: number;
    method: string;
    path: string;
    queryString: string;
    requestData: string;
    responseData: string;
    statusCode: number;
    headers: string;
    timestamp: string;
}

const logs = ref<Log[]>([]);
const logTypeFilter = ref("");
const dateOrderFilter = ref("desc");

// Variables para el modal
const isModalOpen = ref(false);
const selectedLog = ref<Log | null>(null);

onMounted(async () => {
    try {
        logs.value = await obtenerLogs();
    } catch (error) {
        console.error("Error al obtener logs:", error);
    }
});

// Formatear fecha
const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
};

// Categorizar statusCode
const getStatusType = (statusCode: number): string => {
    if (statusCode >= 200 && statusCode < 300) return "Information";
    if (statusCode >= 300 && statusCode < 400) return "Warning";
    if (statusCode >= 400 && statusCode < 500) return "Error";
    return "Critical";
};

// Asignar color a statusCode
const getStatusClass = (statusCode: number): string => {
    if (statusCode >= 200 && statusCode < 300) return "bg-green-500";
    if (statusCode >= 300 && statusCode < 400) return "bg-yellow-500";
    if (statusCode >= 400 && statusCode < 500) return "bg-red-500";
    return "bg-gray-900";
};

// Truncar texto
const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Mostrar modal con detalles completos
const showModal = (log: Log) => {
    selectedLog.value = log;
    isModalOpen.value = true;
};

// Cerrar modal
const closeModal = () => {
    isModalOpen.value = false;
};

// Filtrar logs
const filteredLogs = computed(() => {
    let filtered = [...logs.value];

    if (logTypeFilter.value) {
        filtered = filtered.filter(log => getStatusType(log.statusCode) === logTypeFilter.value);
    }

    return filtered.sort((a, b) =>
        dateOrderFilter.value === "asc"
            ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
});
</script>

<style scoped>
.truncate-text {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.log-box {
    background-color: #f3f4f6;
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-word;
    overflow: auto;
    max-width: 100%;
}
</style>
