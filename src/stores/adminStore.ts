import { defineStore } from "pinia";
import type { User } from "@/interfaces/UserEditInterface";
import adminService from "@/services/admin/adminService";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    admins: [] as User[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAdmins() {
      this.loading = true;
      this.error = null;
      try {
        // Obtener publicaciones desde el servicio
        this.admins = await adminService.getAllUseAdmin();

      } catch (error: any) {
        this.error = "Error al cargar publicaciones";
      } finally {
        this.loading = false;
      }
    },
  },
});
