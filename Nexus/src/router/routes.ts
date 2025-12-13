import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/chat'
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', redirect: '/auth/login' },
      {
        path: 'login',
        name: 'auth.login',
        component: () => import('pages/AuthPage.vue'),
        props: { tab: 'login' },
      },
      {
        path: 'register',
        name: 'auth.register',
        component: () => import('pages/AuthPage.vue'),
        props: { tab: 'register' },
      },
    ],
  },
  // Friendly aliases
  { path: '/login', redirect: '/auth/login' },
  { path: '/register', redirect: '/auth/register' },
  {
    path: '/chat',
    component: () => import('layouts/ChannelLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'chat', component: () => import('pages/ChannelPage.vue') },
      {
        path: ':id',
        name: 'channel',
        component: () => import('pages/ChannelPage.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/profile',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'profile', component: () => import('pages/ProfilePage.vue') }],
  },
  // 404
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
