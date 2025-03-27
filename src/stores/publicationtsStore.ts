import { defineStore } from "pinia";
import PublicationsService from "@/services/PublicationService";
import LikeService from "@/services/LikeService"; // Importar el servicio de likes
import type { Publication } from "@/interfaces/PublicationInterface";

export const usePublicationsStore = defineStore("publications", {
  state: () => ({
    publications: [] as Publication[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Obtener todas las publicaciones desde el backend
    async fetchPublications() {
      this.loading = true;
      this.error = null;
      try {
        // Obtener publicaciones desde el servicio
        this.publications = await PublicationsService.getAllPublications();

        // Inicializar propiedades adicionales para cada publicación
        this.publications.forEach((publication) => {
          publication.hasLiked = false; // Inicializar el estado de "Me gusta"
        });
      } catch (error: any) {
        this.error = "Error al cargar publicaciones";
      } finally {
        this.loading = false;
      }
    },

    // Alternar el estado de "Me gusta" de una publicación
    async toggleLike(publication: Publication) {
      try {
        if (publication.hasLiked) {
          // Eliminar el like desde el backend
          await LikeService.removeLike(publication.id);
          publication.totalLikes = Math.max(publication.totalLikes - 1, 0); // Reducir el contador de likes
        } else {
          // Agregar el like desde el backend
          await LikeService.addLike(publication.id);
          publication.totalLikes += 1; // Incrementar el contador de likes
        }

        // Alternar el estado de "Me gusta"
        publication.hasLiked = !publication.hasLiked;
      } catch (error) {
        console.error("Error al alternar el like:", error);
        this.error = "Error al alternar el like";
      }
    },
  },
});
