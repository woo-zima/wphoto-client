<template>
  <div class="setUp">
    <div class="m-container">
      <ul class="edit-nav">
        <li v-for="(item, index) in liList">
          <a
            :href="item.href"
            :section="item.section"
            :class="{ active: state.activeIndex === index }"
            @click="checkActive(index)"
          >
            {{ item.content }}
          </a>
        </li>
      </ul>
      <div class="edit-content">
        <div class="form_block" id="base_information">
          <h3>基本信息</h3>

          <div class="img_container">
            <a>
              <img src="/public/photo.ico" alt="默认头像" />
            </a>
          </div>
          <div class="base_info">
            <div class="form-item">
              <label for="nickname">昵称</label>
              <input type="text" name="nickname" />
            </div>
            <div class="form-item">
              <label for="nickname">昵称</label>
              <input type="text" name="nickname" />
            </div>
            <div class="form-item">
              <label for="nickname">昵称</label>
              <input type="text" name="nickname" />
            </div>
            <div class="form-item">
              <label for="nickname">昵称</label>
              <input type="text" name="nickname" />
            </div>
          </div>
        </div>

        <div class="form_block" id="about_me">
          <h3>关于我</h3>
          <div class="about_info">
            <div class="form-item">
              <label for="nickname">About me</label>
              <input type="text" name="nickname" />
            </div>
            <div class="form-item">
              <label for="nickname">说明</label>
              <textarea name="" id="" cols="30" rows="10"></textarea>
            </div>
          </div>
        </div>

        <div class="form_block" id="edit_pass">
          <h3>修改密码</h3>
          <div class="pass_info">
            <div class="form-item">
              <label for="nickname">原密码</label>
              <input type="password" v-model="passForm.oldpass" name="nickname" />
            </div>
            <div class="form-item">
              <label for="nickname">新密码</label>
              <input type="password" v-model="passForm.newpass" name="nickname" />
            </div>
            <div class="form-item">
              <label for="nickname">确认密码</label>
              <input type="password" v-model="passForm.validatapass" name="nickname" />
            </div>
            <button @click="updataPassHandle">修改</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive, toRefs } from 'vue';
import { liList } from '@/api/modules/customData';

const $api = inject('$api');
const state = reactive({
  activeIndex: 0,
  passForm: {
    oldpass: '',
    newpass: '',
    validatapass: '',
  },
});
const { passForm } = toRefs(state);
onMounted(() => {
  console.log(liList);
});

const checkActive = index => {
  state.activeIndex = index;
};

const updataPassHandle = async () => {
  console.log(state.passForm);
  const res = await checkPass();
  console.log(res);
};

const checkPass = () => {
  const p = new Promise((resolve, reject) => {
    const { oldpass, newpass, validatapass } = state.passForm;

    if (!oldpass || !newpass || !validatapass) {
      resolve('请输入内容！');
    }
    if (newpass !== validatapass) {
      resolve('两次输入不一致！');
    }
    resolve('verified');
  });
  return p;
};

// const getLocationHash = computed(() => {
//   return window.location.hash.substring(1) === state.actively;
// });
</script>

<style scoped>
.setUp {
  position: relative;
  /* width: 100%; */
  padding-bottom: 30px;
  height: calc(100vh - 120px);
}
.setUp .m-container {
  max-width: 1120px;
  margin: auto;
  overflow: hidden;
  background-color: #fafafa;
  padding: 30px;
}
.edit-nav li a {
  border-left: 2px solid transparent;
  color: #333;
  display: block;
  height: 45px;
  line-height: 45px;
  overflow: hidden;
  padding: 0 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.edit-nav li a.active {
  border-left: 2px solid #ec4d4d;
  color: #ec4d4d;
  font-weight: bold;
}
.edit-nav {
  position: fixed;
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  float: left;
  font-size: 15px;
  line-height: 15px;
  overflow: hidden;
  width: 222px;
  padding: 2px;
}
.edit-content {
  float: right;
  width: calc(100% - 222px - 75px);
}
.img_container {
  float: left;
}
.base_info {
  position: relative;
  padding-left: 34px;
  overflow: hidden;
}
.base_info::before {
  background: #e6e6e6;
  content: '';
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 1px;
}
.base_info label {
  padding-right: 5px;
  font-size: 16px;
}
.base_info input {
  padding: 0 10px;
  height: 28px;
  font-size: 13px;
  line-height: normal;
  border: 1px solid #ccc;
  border-radius: 3px;
}
.form-item {
  padding: 10px 5px;
}
.edit-content .form_block {
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  font-size: 13px;
  margin-bottom: 20px;
  overflow: hidden;
  padding: 28px 10% 28px 30px;
  position: relative;
}

@media (max-width: 824px) {
  .edit-nav {
    display: none;
  }
  .edit-content {
    /* padding: 0 25px; */
    width: 100%;
  }
}
</style>
