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
  async createPublication(publication: Publication): Promise<Publication> {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/Publications`, publication, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      throw error;
    }
  }
}

export default new PublicationsService();
