import { defineStore } from "pinia";
import PublicationsService from "@/services/PublicationService";
import type { Publication } from "@/interfaces/PublicationInterface";

export const usePublicationsStore = defineStore("publications", {
  state: () => ({
    publications: [] as Publication[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchPublications() {
      this.loading = true;
      this.error = null;
      try {
        this.publications = await PublicationsService.getAllPublications();

        // Cargar los likes guardados en localStorage
        const savedLikes = JSON.parse(localStorage.getItem("likedPublications") || "{}");

        this.publications.forEach((publication) => {
          // Si no tiene la propiedad "likes", inicializarla en 0
          publication.likes = publication.likes ?? 0;

          // Verificar si el usuario ya ha dado like y actualizar el estado
          publication.hasLiked = savedLikes[publication.id] || false;

          // Si tiene "me gusta", agregar 1 al contador de likes
          if (publication.hasLiked) {
            publication.likes += 1;
          }
        });

      } catch (error: any) {
        this.error = "Error al cargar publicaciones";
      } finally {
        this.loading = false;
      }
    },

    toggleLike(publication: Publication) {
      const savedLikes = JSON.parse(localStorage.getItem("likedPublications") || "{}");

      if (publication.hasLiked) {
        publication.likes = Math.max(publication.likes - 1, 0); // No baja de 0
        publication.hasLiked = false;
        delete savedLikes[publication.id]; // Eliminar del almacenamiento
      } else {
        publication.likes += 1;
        publication.hasLiked = true;
        savedLikes[publication.id] = true; // Agregar al almacenamiento
      }

      // Guardar los cambios en localStorage
      localStorage.setItem("likedPublications", JSON.stringify(savedLikes));
    },
  },
});
