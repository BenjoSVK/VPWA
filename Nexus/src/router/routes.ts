import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'indexPage', component: () => import('pages/IndexPage.vue') }],
  },
  //TODO login page, register page, etc.
  // Auth (pripravene do budúcna)
  // { path: '/login', name: 'login', component: () => import('pages/LoginPage.vue') },
  // { path: '/register', name: 'register', component: () => import('pages/RegisterPage.vue') },
  {
    path: '/chat',
    component: () => import('layouts/ChannelLayout.vue'),
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
    component: () => import('layouts/ProfileLayout.vue'),
    children: [{ path: '', name: 'profile', component: () => import('pages/ProfilePage.vue') }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
