import axios from "axios";
import type { Publication } from "@/interfaces/PublicationInterface";

const API_URL = "https://localhost:7027/api";

class PublicationsService {
  async getAllPublications(): Promise<Publication[]> {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/Users/publications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
      throw error;
    }
  }
}

export default new PublicationsService();