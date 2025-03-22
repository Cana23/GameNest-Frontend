import { defineStore } from "pinia";
import { login, register } from "@/services/authService";
import type { AuthToken } from "@/interfaces/AuthToken";
import type { RegisterUser } from "@/interfaces/RegisterUser";
import type { UserLogin } from "@/interfaces/UserLogin";
import { useRouter } from "vue-router";

interface AuthState {
  token: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token, // Getter para verificar si el usuario está autenticado
  },

  actions: {
    async loginUser(user: UserLogin): Promise<boolean> {
      try {
        const data: AuthToken = await login(user);
        this.token = data.token;
        localStorage.setItem("token", data.token);
        return true;
      } catch (error) {
        console.error("Error en login:", error);
        return false;
      }
    },

    async registerUser(user: RegisterUser): Promise<boolean> {
      try {
        const response = await register(user);
        if (response.token) {
          this.token = response.token;
          localStorage.setItem("token", response.token);
          console.log("Token almacenado:", response.token);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error en registro:", error);
        return false;
      }
    },

    logout(): void {
      this.token = null;
      localStorage.removeItem("token");

      const router = useRouter();
      router.push({ name: "Login" }).then(() => {
        // Forzar una actualización
        window.location.reload();
      });
    },
  },
});
