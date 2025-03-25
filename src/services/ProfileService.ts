import axios from "axios";
import type { User } from "@/interfaces/UserEditInterface";
import type { Publication } from "@/interfaces/PublicationInterface";

const API_URL = "https://localhost:7027/api";

class ProfileService {
  async getUserProfile(userId: string): Promise<User> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get<User>(`${API_URL}/Users/${userId}`, {
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

  async getUserPublications(userId: string): Promise<Publication[]> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get<Publication[]>(`${API_URL}/Users/publications`, {
        params: { userId },
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
}

export default new ProfileService();
