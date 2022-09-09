<template>
  <div class="dialogMain">
    <el-dialog :modelValue="dialogMainVisible" title="PHOTO" @close="closeDialogHandle">
      <div class="photoDetail">
        <div class="leftImg">
          <img :src="'http://wphoto.top/' + dialogConfig.dialogItem.purl" style="width: 100%" />
        </div>
        <div class="rightMsg">
          <aside class="detail-author">
            <section class="headImg-info">
              <el-avatar @click="toInformation" style="cursor: pointer">
                {{ state.currentPhoto.uname }}
              </el-avatar>
              <h2>{{ state.currentPhoto.uname }}</h2>
            </section>
            <section>
              <el-button color="#626aef" round @click="toFollow">
                {{ state.followFl == null ? '关注' : '已关注' }}
              </el-button>
            </section>
          </aside>
        </div>
      </div>

      <div class="photo-action">
        <el-image
          class="showImg"
          :src="showUrl"
          :preview-src-list="state.srcList"
          :initial-index="0"
          fit="cover"
        />
        <Like :likeMsg="state.likeMsg" />
      </div>

      <div class="photo-content">
        <div class="content-inner">
          <h2>{{ dialogConfig.dialogItem.pname }}</h2>
          <div class="intro">alalalala</div>
          <div class="tags"></div>
          <ul class="star"></ul>
          <div class="data" title="投稿时间">{{ dialogConfig.dialogItem.uptime.slice(0, 10) }}</div>
        </div>
      </div>

      <div class="comment">
        <div class="comment-inner">
          <div class="au-comment">
            <div class="comments-box">
              <!-- 输入框 -->
              <div class="post-comment-container">
                <a href="" class="post-comment-avatar">
                  <el-avatar>user</el-avatar>
                </a>
                <div class="post-comment">
                  <form>
                    <textarea
                      name="commentTextare"
                      v-model="textareaValue"
                      placeholder="请输入评论~"
                      id=""
                      cols="30"
                      rows="10"
                    />
                  </form>
                </div>
                <a class="sbumitComment" @click="sbumitTextarea"><span>发送</span></a>
              </div>

              <!-- 评论列表 -->
              <div class="comment-list">
                <ul>
                  <li class="comment-item" v-for="(item, index) in state.comment" :key="index">
                    <a href="">
                      <el-avatar>user</el-avatar>
                    </a>
                    <div>
                      <h2>{{ item.user.uname }}</h2>
                      <div class="comment-text">{{ item.content }}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="au-saider">
            <div class="author">
              <h3>发布者</h3>
              <div style="display: flex">
                <el-avatar>user</el-avatar>
                <h2 style="margin: 0; padding: 0 10px">{{ state.currentPhoto.uname }}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { randomColorToDom } from '@/modules/my-Tool/randomColorToDom';
import showUrl from '@/assets/img.svg';
import { loginStore } from '../../store';
import { useRouter } from 'vue-router';

let textareaValue = ref('');
const router = useRouter();
const store = loginStore();
const $api = inject('$api');
const props = defineProps({
  dialogConfig: {
    type: Object,
    default: () => {},
  },
});
const state = reactive({
  currentPhoto: {},
  comment: [],
  srcList: [],
  followFl: [],
  likeMsg: {},
});
onBeforeUnmount(() => {
  textareaValue.value = '';
});
onMounted(() => {
  // getPhotoComment(50)
});

const getPhotoComment = async id => {
  const res = await $api.comment.getPhotoComment(id);
  if (res) {
    state.comment = [...res.data];
  }
};

const getPhotoDetail = async pid => {
  const res = await $api.photo.photoDetail(pid);
  if (res.status === 200) {
    state.currentPhoto = res.data.user;
  }
};
//跳转作者详情页
const toInformation = () => {
  let uid = props.dialogConfig.dialogItem.upid || 0;
  router.push({
    path: `/users/Means/${uid}/up`,
  });
};

const dialogMainVisible = computed(() => {
  return props.dialogConfig.showDialog;
});
//获取更新
watch(
  () => props.dialogConfig.dialogItem,
  (newVal, oldVal) => {
    getPhotoComment(newVal.pid);
    getPhotoDetail(newVal.pid);
    getFollowMsg(newVal.upid);
    state.likeMsg = newVal;
    nextTick(() => {
      randomColorToDom('.el-dialog');
    });
    state.srcList = ['http://wphoto.top/' + newVal.purl];
  },
  { deep: true }
);
//dialogMain获取关注
const getFollowMsg = async id => {
  const res = await $api.user.getFollowMsg(store.userDeail.uid);
  if (res) {
    state.followFl = res.data.find(item => {
      return item.followuid === props.dialogConfig.dialogItem.upid;
    });
    // console.log(state.followFl == null);
  }
};
//校验
const vaildCommentText = () => {
  if (textareaValue.value === '' || textareaValue.value === null) {
    return false;
  }
  return true;
};
//评论验证触发
const sbumitTextarea = () => {
  if (!store.userDeail.uname) {
    ElMessage({
      showClose: true,
      message: '请先登录再发布评论',
      type: 'info',
    });
    return;
  }
  if (vaildCommentText()) {
    postComment();
    return;
  }
  ElMessage({
    showClose: true,
    message: '请输入评论再发布',
    type: 'info',
  });
};
//发送评论
const postComment = async () => {
  const commentData = {
    uid: store.userDeail.uid,
    pid: props.dialogConfig.dialogItem.pid,
    content: textareaValue.value,
  };
  const res = await $api.comment.addPhotoComment(commentData);
  if (res.status === 200) {
    textareaValue.value = '';
    getPhotoComment(props.dialogConfig.dialogItem.pid);
    ElMessage({
      showClose: true,
      message: res.data,
      type: 'success',
    });
  }
};
const closeDialogHandle = () => {
  props.dialogConfig.showDialog = false;
  textareaValue.value = '';
};

//DialogMain关注
const toFollow = async () => {
  let uid = store.userDeail.uid,
    followuid = props.dialogConfig.dialogItem.upid;
  const res = await $api.user.addFollow(uid, followuid);
  if (res.status == 200) {
    ElMessage({
      showClose: true,
      message: res.data,
      type: 'success',
    });
  } else {
    ElMessage({
      showClose: true,
      message: '系统出错QAQ',
      type: 'error',
    });
  }
};
</script>

<style>
.el-dialog {
  width: 80vw !important;
  background-color: rgb(51, 48, 48);
}

.el-dialog__body {
  /* width: 100%; */
  padding: 0;
}

.photoDetail {
  display: flex;
  padding-bottom: 7px;
  height: 500px;
}

.leftImg {
  flex: 3;
  padding: 0 20px 0 12px;
}

.leftImg img {
  height: 100%;
  object-fit: contain;
}

.rightMsg {
  flex: 1;
}

.photo-action {
  display: flex;
  justify-content: space-between;
  padding: 2px 10px;
  border-bottom: 1px solid;
}

.photo-action .showImg {
  position: relative;
  left: -2px;
  width: 18px;
  height: 18px;
  z-index: 999;
  padding-right: 96px;
}

.photo-action .showImg::after {
  position: absolute;
  display: inline-block;
  left: 18px;
  top: -1px;
  content: '查看大图';
  width: 88px;
  height: 18px;
}

.photo-content {
  padding: 36px 16px;
  display: flex;
  border-bottom: 1px solid;
}

.photo-content .content-inner {
  width: 100%;
}

.content-inner .tags {
  display: flex;
  color: #ff1e1e;
  line-height: 18px;
  margin: 16px 0;
}

.dialogMain .comment {
  background-color: #fafafa;
  box-sizing: border-box;
  display: inline-block;
  padding: 48px 80px;
  /* text-align: center; */
  width: 100%;
}

.comment .comment-inner {
  display: flex;
}

.comment-inner .au-comment {
  flex: 2;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 2px;
  box-sizing: border-box;
  margin: 0 10px 10px 0;
  padding: 17px 20px;
  text-align: left;
}

.au-comment .post-comment-container {
  display: flex;
  gap: 10px;
}

.post-comment-container .post-comment {
  flex: 1;
}

.post-comment-container form textarea {
  width: 100%;
  padding: 2px;
  resize: none;
}

.post-comment-container .sbumitComment span {
  width: 50px;
  padding: 4px 5px;
  background-color: #acb;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
}

.comment-item {
  display: flex;
  margin-top: 30px;
}

.comment-item h2 {
  margin: 0;
  padding-left: 10px;
}

.comment-item .comment-text {
  padding-left: 10px;
}

.comment-inner .au-saider {
  flex: 1;
  box-sizing: border-box;
}

.au-saider .author {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 0 20px 20px 20px;
}
</style>
