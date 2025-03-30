import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import UserProfile from '@/views/UserProfile.vue'
import HomeVisitor from '../views/Visitor/HomeVisitor.vue'
import ViewHomeUsuario from '@/views/ViewHomeUsuario.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SearchPublicationView from '@/views/SearchPublicationView.vue'
import Tab from 'primevue/tab'
import TableUserView from '@/views/admin/TableUserView.vue'
import TableAdminView from '@/views/admin/TableAdminView.vue'
import adminService from "@/services/adminService";

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
      props: true
    },
    {
      path: "/search-publication",
      name: "Search publication",
      component: SearchPublicationView,
      meta: { requiresAuth: true }
    },
    {
      path: "/user-table",
      name: "Table User",
      component: TableUserView,
      meta: { requiresAuth: true, requiresAdmin: true  }
    },
    {
      path: "/admin-table",
      name: "Table Admin",
      component: TableAdminView,
      meta: { requiresAuth: true, requiresAdmin: true  }
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
      meta: { requiresAuth: false },
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login"); // Si no está autenticado, lo mandamos a login
  } else if (to.meta.requiresAuth && isAuthenticated) {
    const admins = await adminService.getAllUseAdmin();
    const isAdmin = admins.some(admin => admin.email === user?.email);

    if (to.meta.requiresAdmin && !isAdmin) {
      next("/not-found"); // Si no es admin y la ruta requiere admin, mandamos a NotFound
    } else {
      next(); // Si es admin o no requiere admin, seguimos con la navegación
    }
  } else {
    next(); // Si no requiere autenticación, dejamos que continúe
  }
});

export default router
