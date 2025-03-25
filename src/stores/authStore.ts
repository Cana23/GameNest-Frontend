import { defineStore } from "pinia";
import { login, register } from "@/services/authService";
import type { AuthToken } from "@/interfaces/AuthToken";
import type { RegisterUser } from "@/interfaces/RegisterUser";
import type { UserLogin } from "@/interfaces/UserLogin";
import { useRouter } from "vue-router";

interface AuthState {
  token: string | null;
  user: { id: number; username: string; email: string } | null;
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
        this.user = data.user;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

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
