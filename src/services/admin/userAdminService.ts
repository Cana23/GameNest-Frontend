import axios from "axios";
import type { User, UserUpdateRequest } from "@/interfaces/UserEditInterface";

const API_URL = "https://localhost:7027/api/Users";

class AdminUserService {
  // Obtener todos los usuarios con sus roles
  async getAllUsers(): Promise<User[]> {
    try {
      // Obtener el token desde el localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      // Realizar las peticiones con el token Bearer en los encabezados
      const [usersRes, userRoleRes, adminRoleRes] = await Promise.all([
        axios.get<User[]>(`${API_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get<User[]>(`${API_URL}/role/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get<User[]>(`${API_URL}/role/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const userIds = new Set(userRoleRes.data.map((user) => user.id));
      const adminIds = new Set(adminRoleRes.data.map((user) => user.id));

      // Agregar campo 'role' manualmente
      const usersWithRoles: User[] = usersRes.data.map((user) => ({
        ...user,
        role: adminIds.has(user.id) ? "Admin" : userIds.has(user.id) ? "User" : undefined,
      }));

      return usersWithRoles;
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
      throw error;
    }
  }

  // Obtener un usuario por ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw error;
    }
  }

  // Actualizar un usuario
  async updateUser(id: string, updatedData: UserUpdateRequest): Promise<void> {
    try {
      await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  }

  // Eliminar un usuario
  async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  }
}

export default new AdminUserService();
