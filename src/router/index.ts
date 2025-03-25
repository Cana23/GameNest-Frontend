import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import UserProfile from '@/views/UserProfile.vue'
import HomeVisitor from '../views/Visitor/HomeVisitor.vue'
import ViewHomeUsuario from '@/views/ViewHomeUsuario.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ProfileView from '@/views/ProfileView.vue'

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
      path: "/profile/:id",
      name: "Perfil",
      component: ProfileView,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
      meta: { requiresAuth: false },
    }
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  //regidirigir a la pagina de inicio si el usuario esta autenticado
  if (to.meta.forVisitors && isAuthenticated) {
    next('/home'); //pagina de usuarios autenticados
  }

  else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  }


  else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    next('/');
  }
  else {
    next();
  }
});

export default router
