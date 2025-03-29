import axios from 'axios';

const API_URL = 'https://localhost:7027/api';

class CommentsService {
  // Crear un nuevo comentario
  async createComment(commentData: { publicacionId: number; contenido: string }) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/Comments`, commentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Devuelve el comentario creado
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      throw error;
    }
  }

  async updateComment(CommentId: number, Contenido: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/Comments/${CommentId}`, {
        Contenido,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(`Error actualizando comentario ${CommentId}:`, error);
      throw error;
    }
  }

  async deleteComment(CommentId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/Comments/${CommentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(`Error eliminando comentario ${CommentId}:`, error);
      throw error;
    }
  }
}



export default new CommentsService();
