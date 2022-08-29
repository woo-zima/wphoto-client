<template>
    <div class="Register">
        <el-form ref="registerForm" :model="state" status-icon :rules="rules" label-width="80px" label-position="left">
            <el-form-item label="账号" prop="username">
                <el-input v-model="state.username" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input v-model="state.password" :maxlength="20" show-password type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input v-model="state.checkPass" type="password" autocomplete="off" />
            </el-form-item>

            <el-form-item label="验证码" prop="verifyCode">
                <el-row type="flex" justify="space-between" :gutter="16">
                    <el-col>
                        <el-input v-model="state.verifyCode" :maxlength="4"
                            @keyup.enter.native="submitForm('loginForm')">
                            <template #append>
                                <img style="width:90px" :src="imageBase64" @click.stop="getCode">
                            </template>
                        </el-input>
                    </el-col>
                </el-row>
            </el-form-item>

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
import { inject, reactive, ref } from "vue";
import { checkName, validatePass, resetForm, checkCode } from "../../../modules/my-Tool/ruleForm";
import { loginStore } from '@/store'

const $api = inject('$api')
const store = loginStore()
const state = reactive({
    username: '',
    password: '',
    checkPass: '',
    verifyCode: ''
})
const registerForm = ref();
const imageBase64 = ref(
    "http://localhost:3001/getCaptcha/" + Math.floor(Math.random() * 100)
);
const getCode = () => {
    imageBase64.value =
        "http://localhost:3001/getCaptcha/" + Math.floor(Math.random() * 100);
}

const validatePass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== state.password) {
        callback(new Error('两次输入不一致!'));
    } else {
        callback();
    }
};
const rules = reactive({
    username: [{ validator: checkName, trigger: 'blur' }],
    password: [{ validator: validatePass, trigger: 'blur' }],
    checkPass: [{ validator: validatePass2, trigger: 'blur' }],
    verifyCode: [{ validator: checkCode, trigger: 'blur' }]
})
const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            register(formEl)
            console.log('submit!')
        } else {
            console.log('error submit!')
            return false
        }
    })
}
const register = async (formEl) => {
    const registerForm = {
        username: state.username,
        password: state.password,
        verifyCode: state.verifyCode
    }
    try {
        const { data, status } = await $api.user.register(registerForm)
        if (data.userInfo && status === 200) {
            resetForm(formEl);
            store.LoginBoolean(false);
            ElMessage({
                showClose: true,
                message: data.msg,
                type: 'success',
            })
        }
        else {
            resetForm(formEl);
            store.LoginBoolean(false);
            ElMessage({
                showClose: true,
                message: data.msg,
                type: 'error',
            })
        }
    }
    catch (e) {
        console.log(e);
    }

}
</script>

<style>
.Register {
    display: flex;
    justify-content: center;
    align-items: center;
}

.Register .el-form {
    width: 266.5px
}
</style>