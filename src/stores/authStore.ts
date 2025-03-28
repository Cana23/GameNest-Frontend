import { defineStore } from "pinia";
import { login, register } from "@/services/authService";
import type { RegisterUser } from "@/interfaces/RegisterUser";
import type { UserLogin } from "@/interfaces/UserLogin";
import { useRouter } from "vue-router";

interface User {
  id: number;
  userName: string;
  email: string;
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
        this.user = {
          id: data.user.id,
          userName: data.user.userName,
          email: data.user.email
        };

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(this.user));

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
