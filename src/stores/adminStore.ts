import { defineStore } from "pinia";
import type { User } from "@/interfaces/UserEditInterface";
import adminService from "@/services/adminService";

export const useAdminStore = defineStore("users", {
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
        this.users = await adminService.getAllUseAdmin();

      } catch (error: any) {
        this.error = "Error al cargar publicaciones";
      } finally {
        this.loading = false;
      }
    },
  },
});
