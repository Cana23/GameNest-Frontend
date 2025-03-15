import axios from "axios";
import type { AuthToken } from "@/interfaces/AuthToken";
import type { RegisterUser } from "@/interfaces/RegisterUser";
import type { UserLogin } from "@/interfaces/UserLogin";


const API_URL = "http://localhost:7027/api/auth";

export  function login(user: UserLogin): Promise<AuthToken> {
  return axios.post(`${API_URL}/login`, user).then((response) => response.data);
}

export  function register(user: RegisterUser): Promise<void> {
  return axios.post(`${API_URL}/register`, user).then((response) => response.data);
}

// export { UserLogin };

