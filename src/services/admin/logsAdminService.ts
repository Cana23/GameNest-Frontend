import axios from "axios";
import type { Log } from "@/interfaces/LogInterface";

const API_URL = "https://localhost:7027/api/Logs";

export const obtenerLogs = async (): Promise<Log[]> => {
  try {
    const response = await axios.get(API_URL);

    // Verificamos que la respuesta sea un arreglo
    if (Array.isArray(response.data)) {
      return response.data.map((log) => ({
        id: log.id || 0,
        method: log.method || "UNKNOWN",
        path: log.path || "",
        queryString: log.queryString || "",
        requestData: log.requestData || "",
        responseData: log.responseData || "",
        statusCode: log.statusCode || 0,
        headers: log.headers || "",
        timestamp: log.timestamp || new Date().toISOString(),
      }));
    } else {
      throw new Error("La respuesta no es un arreglo válido");
    }
  } catch (error) {
    console.error("Error al obtener logs:", error);
    return [];
  }
};
