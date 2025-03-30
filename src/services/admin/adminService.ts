import axios from "axios";
import type { User } from "@/interfaces/UserEditInterface";

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
}

export default new adminService();
