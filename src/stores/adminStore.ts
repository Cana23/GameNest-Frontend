import { defineStore } from "pinia";
import type { User, UserUpdateRequest } from "@/interfaces/UserEditInterface";
import adminService from "@/services/adminService";

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
        this.admins = await adminService.getAllUseAdmin();

      } catch (error: any) {
        this.error = "Error al cargar publicaciones";
      } finally {
        this.loading = false;
      }
    },
    async createAdmin(user: User) {
          this.loading = true;
          this.error = null;
          try {
            const newUser = await adminService.createAdmin(user);
            this.admins.unshift(newUser);
          } catch (error: any) {
            this.error = "Error al crear el administrador";
          } finally {
            this.loading = false;
          }
        },
        async deleteAdmin(id: string) {
          this.loading = true;
          this.error = null;
          try {
            await adminService.deleteUser(id);
            this.admins = this.admins.filter(admin => admin.id !== id);
          } catch (error: any) {
            this.error = "Error al eliminar el administrador";
          } finally {
            this.loading = false;
          }
        },
        async updateAdmin(id: string, updatedData: UserUpdateRequest) {
          this.loading = true;
          this.error = null;
          try {
            const updatedUser = await adminService.updateUser(id, updatedData);

            // Actualizar el usuario en la lista de administradores
            this.admins = this.admins.map(admin =>
              admin.id === id ? { ...admin, ...updatedUser } : admin
            );

          } catch (error: any) {
            this.error = "Error al actualizar el administrador";
          } finally {
            this.loading = false;
          }
        }
  },
});
