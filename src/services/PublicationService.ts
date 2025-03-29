import axios from 'axios';
import type { Publication } from '@/interfaces/PublicationInterface'; // Asegúrate de que esta ruta sea correcta

const API_URL = "https://localhost:7027/api";

class PublicationsService {
  // Obtener todas las publicaciones
  async getAllPublications(): Promise<Publication[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/Publications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Asumiendo que la respuesta tiene la misma estructura que la interfaz Publication
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      throw error;
    }
  }


  // Crear una nueva publicación
  async createPublication(publication: Publication): Promise<Publication> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/Publications`, publication, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear la publicación:', error);
      throw error;
    }
  }

  async getUserPublications(userId: string): Promise<Publication[]> {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/Users/publications`, {
        params: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener publicaciones del usuario:", error);
      throw error;
    }
  }

  // Guardar (actualizar) una publicación existente
  async savePublication(publication: Publication): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/Publications/${publication.id}`, publication, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      console.log('Publicación actualizada');
    } catch (error) {
      console.error('Error al guardar publicación:', error);
      throw error;
    }
  }
}

export default new PublicationsService();
