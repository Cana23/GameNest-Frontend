import axios from "axios";
import type { User } from "@/interfaces/UserEditInterface";
import type { Publication } from "@/interfaces/PublicationInterface";

const API_URL = "https://localhost:7027/api";

class ProfileService {
  async getUserProfile(): Promise<User> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get<User>(`${API_URL}/Users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  async getUserPublications(): Promise<Publication[]> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get<Publication[]>(`${API_URL}/Users/publications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user publications:", error);
      throw error;
    }
  }


  async changePassword(currentPassword: string, newPassword: string): Promise<string> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${API_URL}/Users/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // Devuelve el mensaje de éxito del backend
    } catch (error: any) {
      console.error("Error al cambiar la contraseña:", error.response?.data || error.message);
      throw error.response?.data || error.message; // Lanza el mensaje de error del backend
    }
  }
}

export default new ProfileService();
