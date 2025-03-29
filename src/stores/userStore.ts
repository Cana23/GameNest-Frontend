import { defineStore } from "pinia";
import UserEditService from "@/services/UserEditService";
import type { User } from "@/interfaces/UserEditInterface";
import UserService from '@/services/UserEditService';

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        // Obtener publicaciones desde el servicio
        this.users = await UserEditService.getAllUser();

      } catch (error: any) {
        this.error = "Error al cargar publicaciones";
      } finally {
        this.loading = false;
      }
    },
  },
});
