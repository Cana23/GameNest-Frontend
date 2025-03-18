import axios from 'axios';

const API_URL = 'https://localhost:7027/api';

class CommentsService {
  async getAllComments() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/Comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
      throw error;
    }
  }

  async getPostComments(PostId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/Comments/${PostId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo comentarios del post:', error);
      throw error;
    }
  }

  async createComment(Contenido: string, PublicacionId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/Comments`, {
        Contenido,
        PublicacionId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error creando comentario:', error);
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
