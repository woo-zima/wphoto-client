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
//取消关注
export function cancelFollow(gzid) {
  return axios({
    url: '/follow/deleteFollowRelation',
    method: 'post',
    data: {
      gzid,
    },
  });
}
//添加关注
export function addFollow(uid, followuid) {
  return axios({
    url: '/follow/addFollowRelation',
    method: 'post',
    data: {
      uid,
      followuid,
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
