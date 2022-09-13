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
    path: '/liked',
    name: 'liked',
    meta: {
      Auth: true,
    },
    component: () => import('../views/Liked.vue'),
  },
  {
    path: '/keyPhotos',
    name: 'keyPhotos',
    component: () => import('../views/SearchResult.vue'),
  },
  {
    path: '/users/Means/:uid',
    name: 'Means',
    meta: {
      Auth: true,
    },
    component: () => import('../views/user/Means.vue'),
    // redirect: '/users/Means/:uid/upl',
    children: [
      {
        path: 'up',
        name: 'Upl',
        meta: {
          Auth: true,
        },
        component: () => import('../views/user/upl.vue'),
      },
      {
        path: 'fans',
        name: 'Fans',
        meta: {
          Auth: true,
        },
        component: () => import('../views/user/Fans.vue'),
      },
      {
        path: 'follow',
        name: 'Follow',
        meta: {
          Auth: true,
        },
        component: () => import('../views/user/Fans.vue'),
      },
    ],
  },
  {
    path: '/users/uploadphoto',
    name: 'UploadPhoto',
    meta: {
      Auth: true,
    },
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

router.beforeEach(async (to, from, next) => {
  let token = localStorage.getItem('userInfo');
  if (to.meta.Auth) {
    if (token) {
      next();
    } else {
      next({
        path: '/',
      });
      ElMessage({
        showClose: true,
        message: '你未登录!',
        type: 'error',
      });
    }
  } else {
    next();
  }
});

export default router;
