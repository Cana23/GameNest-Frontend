import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import UserProfile from '@/views/UserProfile.vue'
import HomeVisitor from '@/views/Visitor/HomeVisitor.vue'
import ViewHomeUsuario from '@/views/ViewHomeUsuario.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SearchPublicationView from '@/views/SearchPublicationView.vue'
import adminService from "@/services/admin/adminService";
import AdminUserView from '@/views/admin/AdminUserView.vue'
import AdminCommentsView from '@/views/admin/AdminCommentsView.vue'
import AdminLogsView from '@/views/admin/AdminLogsView.vue'
import AdminPostsView from '@/views/admin/AdminPostsView.vue'
import {jwtDecode} from "jwt-decode";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home Visitor",
      component: HomeVisitor,
      meta: { requiresAuth: false, forVisitors: true },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/AboutView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { requiresAuth: false, forVisitors: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { requiresAuth: false, forVisitors: true },
    },
    {
      path: "/user-profile",
      name: "user-profile",
      component: UserProfile,
      meta: { requiresAuth: true },
    },
    {
      path: "/home",
      name: "Home User",
      component: ViewHomeUsuario,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile/",
      name: "Perfil",
      component: ProfileView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/search-publication",
      name: "Search publication",
      component: SearchPublicationView,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/users",
      name: "Tabla Usuarios",
      component: AdminUserView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/logs",
      name: "Tabla logs",
      component: AdminLogsView,
      meta: {requiresAuth: true, requiresAdmin: true},
    },
    {
      path: "/admin/comments",
      name: "Tabla comentarios",
      component: AdminCommentsView,
      meta: {requiresAuth: true, requiresAdmin: true},
    },
    {
      path: "/admin/posts",
      name: "Tabla publicaciones",
      component: AdminPostsView,
      meta: {requiresAuth: true, requiresAdmin: true},
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");

  const TokenExpired = IsTokenExpired(token);

  const isAuthenticated = token && !TokenExpired;

  if(token && TokenExpired){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  let isAdmin = false;


  if (isAuthenticated && to.meta.forVisitors) {
    return next(isAdmin ? "/admin/users" : "/home");
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next("/login");
  }

  if (to.meta.requiresAdmin) {
    if (isAuthenticated) {
       isAdmin = await adminService.IsAdmin();
    }

    if(!isAdmin){
      return next("/home");
    }

    return next();
  }

  next();
});


function IsTokenExpired(token: string | null) {
  if (!token) return true; // si no hay token, se considera expirado

  try {
      const { exp } = jwtDecode(token);
      if (!exp) return true; // si no tiene expiracion, se considera inválido

      const Now = Math.floor(Date.now() / 1000);
      return exp < Now; // Retorna true si el token está expirado
  } catch (error) {
      return true; // si falla la decodificación, consideramos el token inválido
  }
}
export default router
