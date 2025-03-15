import axios from "axios";
import type { AuthToken, RegisterUser, UserLogin } from "@/interfaces";


const API_URL = "http://localhost:7027/api/auth";

export  function login(user: UserLogin): Promise<AuthToken> {
  return axios.post(`${API_URL}/login`, user).then((response) => response.data);
}

export  function register(user: RegisterUser): Promise<void> {
  return axios.post(`${API_URL}/register`, user).then((response) => response.data);
}
export { UserLogin };

