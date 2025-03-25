import axios from "axios";
import type { User, UserUpdateRequest } from "@/interfaces/UserEditInterface";

const API_URL = "https://localhost:7027/api";

class UserService {
  async getCurrentUser(id: string): Promise<User> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get<User>(`${API_URL}/users/${id}`, {
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
}

export default new UserService();
