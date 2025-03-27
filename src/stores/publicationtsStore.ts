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

      } catch (error: any) {
        this.error = "Error al cargar publicaciones";
      } finally {
        this.loading = false;
      }
    },

    async createPublication(publication: Publication) {
      this.loading = true;
      this.error = null;
      try {
        const newPublication = await PublicationsService.createPublication(publication);
        this.publications.unshift(newPublication);
      } catch (error: any) {
        this.error = "Error al crear publicación";
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
