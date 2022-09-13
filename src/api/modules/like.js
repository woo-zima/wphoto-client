import axios from '../base.js';
//获取喜欢页数据
function getLikesByUid(uid, pid) {
  return axios({
    url: '/like/getLikesByUid',
    method: 'get',
    params: {
      uid,
      pid,
    },
  });
}
//获取详情页 是否lik
function getLikeByid(uid, pid) {
  return axios({
    url: '/like/getLikeByid',
    method: 'get',
    params: {
      uid,
      pid,
    },
  });
}
//添加like
function addLike(uid, pid) {
  return axios({
    url: '/like/addLikeById',
    method: 'post',
    data: {
      uid,
      pid,
    },
  });
}
function cancelLike(likeid) {
  return axios({
    url: '/like/cancelLike',
    method: 'post',
    data: {
      likeid,
    },
  });
}
export { getLikesByUid, getLikeByid, addLike, cancelLike };
