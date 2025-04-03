import { defineStore } from "pinia";
import { login, register } from "@/services/authService";
import type { UserLogin } from "@/interfaces/UserLogin";
import { useRouter } from "vue-router";
import adminService from "@/services/admin/adminService";
import axios from "axios";
import type { RegisterUser } from "@/interfaces/RegisterUser";

interface User {
  id: number;
  userName: string;
  email: string;
  role?: string;
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
    async loginUser(user: UserLogin): Promise<boolean | string> {
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

        return true;
      } catch (error: any) {
        console.error("Error en login:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return "Correo electrónico o contraseña incorrectos.";
        } else if (axios.isAxiosError(error)) {
          return "Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.";
        } else {
          return "Ocurrió un error inesperado.";
        }
      }
    },


    async registerUser(user: RegisterUser): Promise<boolean | string[]> {
      try {
        const response = await register(user);
        if (response.token) {
          this.token = response.token;
          localStorage.setItem("token", response.token);
          console.log("Token almacenado:", response.token);
          return true;
        }
        return false;
      } catch (error: any) {
        console.error("Error en registro:", error);
        if (axios.isAxiosError(error) && error.response?.status === 400 && error.response.data) {
          if (error.response.data.message) {
            return [error.response.data.message];
          }
          if (error.response.data.errors) {
            const errors = error.response.data.errors;
            if (Array.isArray(errors)) {
              return errors.map((err: any) => err.Description);
            } else if (typeof errors === 'object') {
              const errorMessages: string[] = [];
              for (const key in errors) {
                if (Array.isArray(errors[key])) {
                  errorMessages.push(...errors[key]);
                } else if (typeof errors[key] === 'string') {
                  errorMessages.push(errors[key]);
                }
              }
              return errorMessages;
            }
          }
        }
        return [error.message || "Error al registrar el usuario. Inténtalo de nuevo."];
      }
    },


    logout(): void {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.reload();
    },
  },
});
