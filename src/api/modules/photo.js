import axios from '../base.js';
import Qs from 'qs';

function getPhotoList(pageNum) {
  return axios({
    url: '/photo/getPhotoList',
    method: 'post',
    data: {
      startIndex: pageNum,
      pageSize: 16,
    },
  });
}
function getRankByKey(keyword, pageNum) {
  return axios({
    url: '/photo/searcherphoto',
    method: 'get',
    params: {
      key: keyword,
      startIndex: pageNum,
      pageSize: 20,
    },
  });
}
function addPhoto(params) {
  return axios({
    url: '/photo/addPhoto',
    method: 'post',
    data: params,
  });
}
//模糊查询搜索
function getKeyWorlds(params) {
  return axios({
    url: '/photo/getKeyWorlds',
    method: 'get',
    params,
  });
}
//模糊搜索结果
function getKeyPhotos(params) {
  return axios({
    url: '/photo/getKeyPhotos',
    method: 'get',
    params,
  });
}
//图片发布者
function photoDetail(pid) {
  return axios({
    url: '/photo/showPhotoDetail',
    method: 'get',
    params: {
      pid,
    },
  });
}
export { getPhotoList, getRankByKey, addPhoto, getKeyWorlds, photoDetail, getKeyPhotos };
