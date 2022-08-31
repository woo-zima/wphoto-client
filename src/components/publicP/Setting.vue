<template>
    <div class="Setting">
        <el-dialog :visible.sync="localVisible" title="设置" width="600px" @close="handleClose">
            <div class="modal-body">
                <div class="message-list">
                    <div>
                        <p>NAME:</p>
                    </div>
                    <div>
                        <p>EMAIL:</p>
                    </div>

                </div>

                <div class="change-avatar">
                    <vueCropper ref="cropper" :auto-crop="option.autoCrop" :fixed="option.fixed" :img="option.img"
                        :output-size="option.size" class="cropper" crossorigin="anonymous" />
                    <div class="upload">
                        <el-button class="btn">
                            上传图片
                        </el-button>
                        <input id="uploads" ref="fileHander" accept="image/png, image/jpeg, image/gif, image/jpg"
                            type="file" @change="handleLocalImg($event)">
                        <el-button :loading="loading" @click="saveAvatar">
                            确定头像
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
    settingVisible: {
        type: Boolean,
        default: () => false,
    },
    user: {
        type: Object,
        default: () => { },
    },
})

const state = reactive({
    option: {
        img: ``,
        size: 0.1,
        autoCrop: true,
        fixed: true,
    },
    loading: false
})

const handleLocalImg = (e) => {
    const file = e.target.files[0];
    if (!/\.(jpg|jpeg|png|webp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message.info('请选择正确的图片格式');
        return false;
    }
    if (file.size > 5 * 1024 * 1024) {
        this.$message.info('图片大小不能超过5M');
        return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
            data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
            data = e.target.result;
        }
        this.option.img = data;
        console.log(data);
    };
    reader.readAsArrayBuffer(file);

}

const saveAvatar = () => {
    state.loading = true;
    this.$refs.cropper.getCropBlob(async (data) => {
        console.log(data);
        const type = data.type.split('/')[1];
        const files = new File([data], `${this.user.userId}.${type}`, {
            type: data.type,
        });
        const formData = new FormData();
        formData.append('file', files);
        formData.append('userId', this.user.userId)
        //console.log(formData.get('userId'));
        const result = await this.$api.user.uploadImg(formData);
        if (result.status === 200) {
            this.$message.success('更新头像成功');
            this.$store.commit('setHead', result.data);
            localStorage.user = JSON.stringify(this.$store.state.user);
        } else {
            this.$message.error('更新失败，请重试');
        }
        //console.log(result);
        this.loading = false;
    }
</script>

<style scoped>
</style>