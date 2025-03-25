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
        console.log(this.publications)
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
  },
});
