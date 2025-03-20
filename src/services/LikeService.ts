import axios from 'axios';

const API_URL = 'https://localhost:7027/api/Likes/';

class LikesService {
  async getPostLikes(PostId: number) {
    try {
      const response = await axios.get(`${API_URL}/${PostId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo likes:', error);
      throw error;
    }
  }

  async addLike(PostId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/${PostId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error agregando like:', error);
      throw error;
    }
  }

  async removeLike(PostId: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/${PostId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error eliminando like:', error);
      throw error;
    }
  }
}

export default new LikesService();
