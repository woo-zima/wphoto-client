<template>
    <div class="Register">
        <el-form ref="registerForm" :model="ruleForm" status-icon :rules="rules" label-width="100px"
            label-position="left">
            <el-form-item label="账号" prop="username">
                <el-input v-model="ruleForm.username" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password" :maxlength="20" show-password type="password"
                    autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
            </el-form-item>

            <!-- <el-form-item
        label="验证码"
        prop="verifyCode"
      >
        <el-row
          type="flex"
          justify="space-between"
          :gutter="16"
        >
          <el-col>
            <el-input
              v-model="loginForm.verifyCode"
              :maxlength="4"
              @keyup.enter.native="submitForm('loginForm')"
            >
              <template slot="append">
                <img
                  style="width:90px"
                  :src="imageBase64"
                  @click.stop="getCode"
                >
              </template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item> -->

            <el-form-item>
                <el-button type="primary" @click="submitForm(registerForm)">
                    登录
                </el-button>
                <el-button @click="resetForm(registerForm)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { checkName, validatePass, resetForm } from "../../../modules/my-Tool/ruleForm";

const ruleForm = reactive({
    username: '',
    password: '',
    checkPass: '',
})
const registerForm = ref();

const validatePass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== ruleForm.password) {
        callback(new Error('两次输入不一致!'));
    } else {
        callback();
    }
};
const rules = reactive({
    username: [{ validator: checkName, trigger: 'blur' }],
    password: [{ validator: validatePass, trigger: 'blur' }],
    checkPass: [{ validator: validatePass2, trigger: 'blur' }],
})
const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!')
            return false
        }
    })
}
</script>

<style>
.Register {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>