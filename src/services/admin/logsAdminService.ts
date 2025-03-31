import axios from "axios";

// Ruta de la API de logs
const API_URL = "https://localhost:7027/api/Logs";

// Función para obtener los logs
export const obtenerLogs = async (): Promise<string[]> => {
  try {
    const response = await axios.get(API_URL);
    // Aseguramos que la respuesta sea un arreglo
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error("La respuesta no es un arreglo");
    }
  } catch (error) {
    console.error("Error al obtener logs:", error);
    return [];
  }
};
