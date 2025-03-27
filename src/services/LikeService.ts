import axios from "axios";

const API_URL = "https://localhost:7027/api";

class LikeService {
  // Agregar un like a una publicación
  async addLike(postId: number): Promise<void> {
    try {
      await axios.post(`${API_URL}/Likes/${postId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token de autorización
        },
      });
    } catch (error) {
      console.error("Error al agregar like:", error);
      throw error;
    }
  }

  // Eliminar un like de una publicación
  async removeLike(postId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/Likes/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token de autorización
        },
      });
    } catch (error) {
      console.error("Error al eliminar like:", error);
      throw error;
    }
  }
}

export default new LikeService();
