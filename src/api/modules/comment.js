import axios from '../base.js';

function getPhotoComment(params) {
  return axios({
    url: '/comment/getPhotoComment',
    method: 'get',
    params: {
      pid: params,
    },
  });
}
function addPhotoComment(data) {
  return axios({
    url: '/comment/addComment',
    method: 'post',
    data,
  });
}

export { getPhotoComment, addPhotoComment };
