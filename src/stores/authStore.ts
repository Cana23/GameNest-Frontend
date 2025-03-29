import { defineStore } from "pinia";
import { login } from "@/services/authService";
import type { UserLogin } from "@/interfaces/UserLogin";
import { useRouter } from "vue-router";
import adminService from "@/services/adminService";

interface User {
  id: number;
  userName: string;
  email: string;
  role?: string; // El rol es opcional aquí
}

interface AuthState {
  token: string | null;
  user: User | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem("token") || null,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async loginUser(user: UserLogin): Promise<boolean> {
      try {
        const data = await login(user);
        this.token = data.token;

        // Guardar solo la información básica del usuario
        this.user = {
          id: data.user.id,
          userName: data.user.userName,
          email: data.user.email,
        };

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        // Verificar si el usuario es un admin solo para la sesión actual
        const admins = await adminService.getAllUseAdmin();
        const isAdmin = admins.some(admin => admin.email === this.user?.email);

        if (isAdmin) {
          // Si es admin, puede acceder a las rutas de admin, pero no guardamos el rol
          // Aquí no modificamos el estado del rol ni lo almacenamos en localStorage
          console.log('Usuario es admin');
        }

        return true;
      } catch (error) {
        console.error("Error en login:", error);
        return false;
      }
    },

    logout(): void {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const router = useRouter();
      router.push({ name: "login" }).then(() => {
        window.location.reload();
      });
    },
  },
});
