import axios from "axios";
import type { User, UserUpdateRequest } from "@/interfaces/UserEditInterface";

const API_URL = "https://localhost:7027/api";

class UserService {
  async getCurrentUser(): Promise<User> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Obtener el ID del usuario desde el store o localStorage
      const userData = localStorage.getItem("user");
      if (!userData) {
        throw new Error("No user data found");
      }

      const user = JSON.parse(userData);
      const response = await axios.get<User>(`${API_URL}/Users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
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

  async getAllUser(): Promise<User[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/Users/role/user`, {
        headers: { Authorization: `Bearer + ${token}` },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      throw error;
    }
  }
  async getAllAdmin(): Promise<User[]> {
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

export default new UserService();
