import axios from "axios";
import type { User } from "@/interfaces/UserEditInterface";
import type { Comment } from "@/interfaces/PublicationInterface";

const API_URL = "https://localhost:7027/api";

class adminService {
  async getAllUseAdmin(): Promise<User[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/Users/role/admin`, {
        headers: { Authorization: `Bearer + ${token}` },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      throw error;
    }
  }

  async getAllComments(): Promise<Comment[]>{
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/Comments`, {
        headers: { Authorization: `Bearer + ${token}` },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
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

export default new adminService();
