import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/rank',
    name: 'rank',
    component: () => import('../views/RankingList.vue'),
  },
  {
    path: '/browsing',
    name: 'browsing',
    component: () => import('../views/BrowsingList.vue'),
  },
  {
    path: '/keyPhotos',
    name: 'keyPhotos',
    component: () => import('../views/SearchResult.vue'),
  },
  {
    path: '/users/Means/:uid',
    name: 'Means',
    component: () => import('../views/user/Means.vue'),
    // redirect: '/users/Means/:uid/upl',
    children: [
      {
        path: 'up',
        name: 'Upl',
        component: () => import('../views/user/upl.vue'),
      },
      {
        path: 'fans',
        name: 'Fans',
        component: () => import('../views/user/Fans.vue'),
      },
      {
        path: 'follow',
        name: 'Follow',
        component: () => import('../views/user/Fans.vue'),
      },
    ],
  },
  {
    path: '/users/uploadphoto',
    name: 'UploadPhoto',
    component: () => import('../views/user/UploadPhoto.vue'),
  },
  // {
  //   path: '/photoDetail',
  //   name: 'photoDetail',
  //   component: () => import('../views/PhotoDetail.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
