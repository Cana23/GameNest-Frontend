import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import UserProfile from '@/views/UserProfile.vue'
import HomeVisitor from '../views/Visitor/HomeVisitor.vue'
import ViewHomeUsuario from '@/views/ViewHomeUsuario.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SearchPublicationView from '@/views/SearchPublicationView.vue'
import adminService from "@/services/admin/adminService";
import AdminUserView from '@/views/admin/AdminUserView.vue'
import AdminLogsView from '@/views/admin/AdminLogsView.vue'

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
      component: () => import("../views/AboutView.vue"),
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
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/logs",
      name: "Tabla logs",
      component: AdminLogsView,
      meta: {requiresAuth: true},
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
      meta: { requiresAuth: false, requiresAdmin: false },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuthenticated = !!token;

  // Verifica si el usuario está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresAdmin) {
    // Verifica si el usuario tiene el rol de admin
    const admins = await adminService.getAllUseAdmin();
    const isAdmin = admins.some(admin => admin.email === user?.email);

    if (isAdmin) {
      next(); // Si es admin, permitir el acceso
    } else {
      next("/home"); // Si no es admin, redirigir a la página principal
    }
  } else {
    next(); // Si no requiere autenticación o admin, permite el acceso
  }
});


export default router
