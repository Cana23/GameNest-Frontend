import axios from 'axios';
import type { Publication } from '@/interfaces/PublicationInterface';

const API_URL = "https://localhost:7027/api";

class PublicationsService {
  // Obtener todas las publicaciones
  async getAllPublications(): Promise<Publication[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/Publications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      throw error;
    }
  }

  // Obtener una publicación por ID
  async getPublicationById(id: number): Promise<Publication> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/Publications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener la publicación:', error);
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

  // Actualizar una publicación existente
  async updatePublication(id: number, publication: Publication): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/Publications/${id}`, publication, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      console.log('Publicación actualizada');
    } catch (error) {
      console.error('Error al actualizar la publicación:', error);
      throw error;
    }
  }

  // Eliminar una publicación (lógica)
  async deletePublication(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/Publications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Publicación eliminada');
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      throw error;
    }
  }

  // Ocultar una publicación
  async hidePublication(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/Publications/hide/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Publicación oculta');
    } catch (error) {
      console.error('Error al ocultar la publicación:', error);
      throw error;
    }
  }

  // Desocultar una publicación
  async unhidePublication(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/Publications/unhide/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Publicación desocultada');
    } catch (error) {
      console.error('Error al desocultar la publicación:', error);
      throw error;
    }
  }
}

export default new PublicationsService();
