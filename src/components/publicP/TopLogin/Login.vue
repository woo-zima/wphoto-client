<template>
  <div class="Login">
    <el-form
      ref="loginForm"
      :model="state.loginForm"
      status-icon
      :rules="rules"
      label-width="70px"
      label-position="left"
    >
      <el-form-item label="账号" prop="username">
        <el-input v-model="state.loginForm.username" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="state.loginForm.password"
          :maxlength="20"
          show-password
          type="password"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item label="验证码" prop="verifyCode">
        <el-row type="flex" justify="space-between" :gutter="16">
          <el-col>
            <el-input
              v-model="state.loginForm.verifyCode"
              :maxlength="4"
              @keyup.enter.native="submitForm('loginForm')"
            >
              <template #append>
                <img style="width: 90px" :src="imageBase64" @click.stop="getCode" />
              </template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button class="" type="primary" @click="submitForm(loginForm)">登录</el-button>
        <el-button @click="resetForm(loginForm)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { checkName, validatePass, resetForm, checkCode } from '@/modules/my-Tool/ruleForm';
import { loginStore } from '../../../store';

const store = loginStore();
const $api = inject('$api');
const state = reactive({
  loginForm: {
    username: '',
    password: '',
    verifyCode: '',
  },
});
const imageBase64 = ref('http://localhost:3001/getCaptcha/' + Math.floor(Math.random() * 100));
const getCode = () => {
  imageBase64.value = 'http://localhost:3001/getCaptcha/' + Math.floor(Math.random() * 100);
};
const loginForm = ref();
const rules = reactive({
  username: [{ validator: checkName, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
  verifyCode: [{ validator: checkCode, trigger: 'blur' }],
});
const submitForm = formEl => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      login(formEl);
    } else {
      return false;
    }
  });
};
const login = async formEl => {
  try {
    const { data, status } = await $api.user.login(state.loginForm);
    if (data.userInfo && status === 200) {
      resetForm(formEl);
      store.LoginBoolean(false);
      localStorage.token = data.token;
      localStorage.userInfo = JSON.stringify(data.userInfo);
      store.setUserInfo(data.userInfo);
      ElMessage({
        showClose: true,
        message: data.msg,
        type: 'success',
      });
    } else {
      getCode();
      ElMessage({
        showClose: true,
        message: data.msg,
        type: 'error',
      });
    }
  } catch (e) {
    console.log(e);
  }
};
</script>

<style>
.Login {
  display: flex;
  justify-content: center;
  align-items: center;
}

.Login .el-form {
  width: 246.5px;
}

.el-button,
.el-button:active,
.el-button:focus {
  color: #fff;
  background-color: #202d40;
  border-color: #202d40;
}

.el-button:hover {
  color: #fff;
  border-color: #ff1e1e;
  background-color: #ff1e1e;
  outline: 0;
}

.el-input-group__append {
  padding: 0;
}
</style>
