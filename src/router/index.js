import { createRouter, createWebHistory } from 'vue-router';

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err);
// };

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
  },
  {
    path: '/users/followed',
    name: 'Followed',
    component: () => import('../views/user/Followed.vue'),
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
