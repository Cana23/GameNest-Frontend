import { defineStore } from "pinia";
import { login, register } from "@/services/authService";
import type { AuthToken, RegisterUser, UserLogin } from "@/interfaces";

interface AuthState {
  token: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem("token") || null,
  }),

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
        await register(user);
        return true;
      } catch (error) {
        console.error("Error en registro:", error);
        return false;
      }
    },

    logout(): void {
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
