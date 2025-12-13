import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth/auth';
import { getAuthToken } from 'src/lib/api';

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Navigation guards
  Router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();
    
    // Check if token exists - if not, user is definitely not authenticated
    const hasToken = !!getAuthToken();
    
    // If no token, reset auth state and allow navigation to auth pages
    if (!hasToken) {
      auth.$reset();
    }
    
    // Initialize auth if not done yet and we have a token
    if (!auth.initialized && hasToken) {
      await auth.initialize();
    }

    const isAuthenticated = auth.isAuthenticated && hasToken;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthPage = to.path.startsWith('/auth');

    // If route requires auth and user is not authenticated
    if (requiresAuth && !isAuthenticated) {
      next({ path: '/auth/login', query: { redirect: to.fullPath } });
      return;
    }

    // If user is authenticated and trying to access auth pages
    if (isAuthenticated && isAuthPage) {
      next({ path: '/chat' });
      return;
    }

    next();
  });

  return Router;
});
