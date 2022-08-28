<template>
    <el-dialog :modelValue="store.loginBoolean" width="600px" :title="`${loginOrSign ? '登录' : '注册'}`"
        @close="closeHandle">
        <Login v-show="loginOrSign" />
        <Register v-show="!loginOrSign" />
    </el-dialog>

</template>

<script setup>
import { loginStore } from '../../../store';
import { storeToRefs } from 'pinia';
const store = loginStore()
const { loginOrSign } = storeToRefs(store)

const closeHandle = () => {
    store.LoginBoolean(false);
}
</script>

<style>
</style>