import axios from "axios";
import type { User, UserUpdateRequest } from "@/interfaces/UserEditInterface";

const API_URL = "https://localhost:7027/api";

class adminService {
  async createAdmin(user: User): Promise<User> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/Users`, user, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear el administrador:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: UserUpdateRequest): Promise<User> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put<User>(`${API_URL}/Users/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete<User>(`${API_URL}/Users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

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
