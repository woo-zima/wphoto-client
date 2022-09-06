import axios from '../base.js';
import Qs from 'qs';

//获取七牛云token
export function getQiNiuToken() {
  return axios({
    url: '/getToken',
    method: 'get',
  });
}
// 获取图形验证码
export function getCaptcha(t) {
  return axios({
    url: `/getCaptcha/${t}`,
    method: 'get',
  });
}

// 登录
export function login(params) {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: params,
  });
}

//注册
export function register(params) {
  return axios({
    url: '/auth/register',
    method: 'post',
    data: params,
  });
}
// 用户头像上传
export function uploadImg(param) {
  return axios({
    url: '/system/user/editheadurl',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param,
  });
}
//获取用户信息
export function getUpMsg(id) {
  return axios({
    url: `/users/${id}`,
    method: 'get',
  });
}

//获取关注
export function getFollowMsg(uid) {
  return axios({
    url: '/follow/getFollowRelation',
    method: 'get',
    params: {
      uid,
    },
  });
}
//获取粉丝
export function getFansMsg(uid) {
  return axios({
    url: '/follow/getFansRelation',
    method: 'get',
    params: {
      uid,
    },
  });
}

//获取是否收藏
export function issc(uid, pid) {
  return axios({
    url: '/system/sctable/issc',
    method: 'get',
    params: {
      uid: uid,
      pid: pid,
    },
  });
}
//获取收藏列表
export function scquery(uid) {
  return axios({
    url: '/system/sctable/scquery',
    method: 'get',
    params: {
      uid: uid,
    },
  });
}
//添加收藏
export function scadd(params) {
  return axios({
    url: '/system/sctable/scadd',
    method: 'post',
    transformRequest: [
      function (data) {
        return Qs.stringify(data);
      },
    ],
    headers: {
      deviceCode: 'A95ZEF1-47B5-AC90BF3',
    },
    crossDomain: true,
    data: params,
  });
}
//取消收藏
export function remove(params) {
  return axios({
    url: '/system/sctable/remove',
    method: 'post',
    transformRequest: [
      function (data) {
        return Qs.stringify(data);
      },
    ],
    headers: {
      deviceCode: 'A95ZEF1-47B5-AC90BF3',
    },
    crossDomain: true,
    data: params,
  });
}
//获取收藏数
export function scnum(pid) {
  return axios({
    url: '/system/photo/getNum',
    method: 'get',
    params: {
      pid: pid,
    },
  });
}
//获取排行榜
export function scrank(start) {
  return axios({
    url: '/system/photo/getRank',
    method: 'get',
    params: {
      startIndex: start,
      pageSize: 20,
    },
  });
}
//获取最近浏览列表
export function zjlook(uid) {
  return axios({
    url: '/system/looktable/zjlook',
    method: 'get',
    params: {
      uId: uid,
    },
  });
}

//点击图片添加点击时间
export function zjlookadd(params) {
  return axios({
    url: '/system/looktable/zjlookadd',
    method: 'post',
    transformRequest: [
      function (data) {
        return Qs.stringify(data);
      },
    ],
    headers: {
      deviceCode: 'A95ZEF1-47B5-AC90BF3',
    },
    crossDomain: true,
    data: params,
  });
}
