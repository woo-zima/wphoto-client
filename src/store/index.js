import { defineStore } from 'pinia';

export const loginStore = defineStore('login', {
  state: () => {
    return {
      loginOrSign: true,
      loginBoolean: false,
      isAdmin: true,
      token: '',
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
    };
  },
  getters: {
    showUser(state) {
      return Object.keys(state.userInfo).length === 0 ? false : true;
    },
    userDeail(state) {
      return state.userInfo;
    },
  },
  actions: {
    LoginBoolean(Boolean) {
      this.loginBoolean = Boolean;
    },
    LoginOrSign(Boolean) {
      this.loginOrSign = Boolean;
    },
    setUserInfo(info) {
      this.userInfo = info;
    },
  },
});
