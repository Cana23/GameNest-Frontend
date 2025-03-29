import axios from "axios";
import type { RegisterUser } from "@/interfaces/RegisterUser";
import type { UserLogin } from "@/interfaces/UserLogin";


const API_URL = "https://localhost:7027/api/Auth";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function login(user: UserLogin): Promise<{ token: string; user: { id: number; userName: string; email: string  } }> {
  return axios.post(`${API_URL}/login`, user).then((response) => response.data);
}


export function register(user: RegisterUser): Promise<{ token: string }> {
  return axios.post(`${API_URL}/register`, user).then((response) => response.data);
}

export function logout(): Promise<void> {
  return axios.post(`${API_URL}/logout`).then(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  });

}




