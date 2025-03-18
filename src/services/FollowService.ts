import axios from 'axios';

const API_URL = 'https://localhost:7027/api/';

class FollowersService {
  async getAllFollowers(UserId: string) {
    try {
      const response = await axios.get(`${API_URL}/Followers/${UserId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo seguidores:', error);
      throw error;
    }
  }

  async getFollowerCount(UserId: string) {
    try {
      const response = await axios.get(`${API_URL}/FollowerCount/${UserId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo cantidad de seguidores:', error);
      throw error;
    }
  }

  async follow(UserId: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/Follow/${UserId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error siguiendo usuario:', error);
      throw error;
    }
  }

  async unFollow(UserId: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/UnFollow/${UserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error dejando de seguir usuario:', error);
      throw error;
    }
  }
}

export default new FollowersService();
